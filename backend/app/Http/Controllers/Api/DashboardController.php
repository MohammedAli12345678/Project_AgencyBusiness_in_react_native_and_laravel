<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Investment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard data using existing models
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');

            // ============ STATS CARDS ============
            $totalProjects = Product::count();

            $totalProductActive = Product::where('status', 'Active')->count();
            $totalProductCompleted = Product::where('status', 'completed')->count();
            $totalProductBeta = Product::where('status', 'Beta')->count();

            $activeInvestments = Investment::where('status', 'completed')
                ->sum('amount') ?? 0;

            $activeInvestors = Investment::where('status', 'completed')
                ->distinct('user_id')
                ->count('user_id');

            // ROI Calculation
            $roiResult = DB::table('investments as i')
                ->join('products as p', 'i.product_id', '=', 'p.product_id')
                ->where('i.status', 'completed')
                ->select(DB::raw('ROUND(((SUM(p.price) - SUM(i.amount)) / SUM(i.amount)) * 100, 2) as total_roi'))
                ->first();
            
            $totalRoi = $roiResult->total_roi ?? 0;

            // ============ RECENT PROJECTS (Unique projects with totals) ============
            $recentProjects = DB::table('products as p')
                ->select(
                    'p.product_id as id',
                    'p.product_name as name',
                    'p.start_date',
                    'p.status',
                    DB::raw('COALESCE((SELECT SUM(amount) FROM investments WHERE product_id = p.product_id AND status = "completed"), 0) as total_amount'),
                    DB::raw('COALESCE((SELECT COUNT(id) FROM investments WHERE product_id = p.product_id AND status = "completed"), 0) as investment_count'),
                    DB::raw('COALESCE((SELECT ROUND(AVG((amount / p.budget) * 100), 2) FROM investments WHERE product_id = p.product_id AND status = "completed"), 0) as avg_roi')
                )
                ->whereExists(function ($query) {
                    $query->select(DB::raw(1))
                          ->from('investments')
                          ->whereColumn('investments.product_id', 'p.product_id')
                          ->where('investments.status', 'completed');
                })
                ->orderBy('p.start_date', 'desc')
                ->limit(10);

            if (!empty($search)) {
                $recentProjects->whereRaw('LOWER(p.product_name) LIKE ?', ['%' . strtolower($search) . '%']);
            }

            $recentProjects = $recentProjects->get();

            // تحويل البيانات للشكل المطلوب مع التأكد من الأرقام
            $formattedProjects = [];
            foreach ($recentProjects as $project) {
                $totalAmount = floatval($project->total_amount ?? 0);
                $avgRoi = floatval($project->avg_roi ?? 0);
                
                $amountInK = $totalAmount > 0 ? $totalAmount / 1000 : 0;
                
                $formattedProjects[] = [
                    'id' => $project->id,
                    'name' => $project->name,
                    'start_date' => $project->start_date,
                    'status' => $project->status,
                    'investment_display' => $totalAmount > 0 
                        ? '$' . number_format($amountInK, 1) . 'k' 
                        : '$0k',
                    'roi_display' => $avgRoi > 0 ? $avgRoi . '%' : '0%',
                ];
            }

            // ============ CHART DATA ============
            $monthlyData = Investment::where('status', 'completed')
                ->whereYear('created_at', date('Y'))
                ->select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('total', 'month')
                ->toArray();

            $chartData = [];
            for ($i = 1; $i <= 12; $i++) {
                $chartData[] = $monthlyData[$i] ?? 0;
            }

            // ============ STATUS DISTRIBUTION ============
            $statusDistribution = [
                ['status' => 'Active', 'count' => $totalProductActive],
                ['status' => 'Completed', 'count' => $totalProductCompleted],
                ['status' => 'Beta', 'count' => $totalProductBeta],
            ];

            // ============ FINAL RESPONSE ============
            return response()->json([
                'success' => true,
                'stats' => [
                    ['title' => 'Total Projects', 'value' => (string) $totalProjects, 'change' => '+5%'],
                    ['title' => 'Active Investments', 'value' => '$' . number_format($activeInvestments / 1000, 1) . 'k', 'change' => '+12%'],
                    ['title' => 'Total ROI', 'value' => $totalRoi . '%', 'change' => '-3%'],
                    ['title' => 'Active Investors', 'value' => (string) $activeInvestors, 'change' => '+7%'],
                ],
                'recent_projects' => $formattedProjects,
                'chart' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    'datasets' => [['data' => $chartData]]
                ],
                'status_distribution' => $statusDistribution,
                'search' => $search,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}