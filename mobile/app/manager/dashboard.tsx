/*
import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TextInput,
Dimensions
} from "react-native";

import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {

const [search,setSearch] = useState("");

const stats = [
{title:"Total Projects",value:"12",change:"+5%"},
{title:"Active Investments",value:"$230k",change:"+12%"},
{title:"Total ROI",value:"18%",change:"+3%"},
{title:"Active Investors",value:"45",change:"+7%"},
];

const projects = [

{
id:1,
name:"AI Marketing Platform",
date:"Started 2 days ago",
status:"Active",
investment:"$200,000",
roi:"15%"
},

{
id:2,
name:"Blockchain Payment System",
date:"Started 5 days ago",
status:"Completed",
investment:"$500,000",
roi:"22%"
},

{
id:3,
name:"Smart Home Automation",
date:"Starting next week",
status:"Upcoming",
investment:"$180,000",
roi:"12%"
}

];

const chartData = {

labels:["Jan","Feb","Mar","Apr","May","Jun"],

datasets:[
{
data:[1000,2500,2000,3500,4200,5000]
}
]

};

const filteredProjects = projects.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase())
);

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>
Project Dashboard
</Text>

// Stats 

<View style={styles.statsGrid}>

{stats.map((item,index)=>(

<View key={index} style={styles.statCard}>

<Text style={styles.statTitle}>
{item.title}
</Text>

<Text style={styles.statValue}>
{item.value}
</Text>

<Text style={styles.statChange}>
{item.change} from last month
</Text>

</View>

))}

</View>

// Chart 

<View style={styles.chartCard}>

<Text style={styles.sectionTitle}>
Investment Analytics
</Text>

<LineChart
data={chartData}
width={screenWidth-40}
height={220}
bezier
chartConfig={{

backgroundGradientFrom:"#fff",
backgroundGradientTo:"#fff",

decimalPlaces:0,

color:(opacity=1)=>`rgba(79,70,229,${opacity})`,

labelColor:()=>"#64748b",

propsForDots:{
r:"5",
strokeWidth:"2",
stroke:"#4f46e5"
}

}}
style={{borderRadius:16}}
/>

</View>

 //Projects 

<View style={styles.tableCard}>

<Text style={styles.sectionTitle}>
Recent Projects
</Text>

<TextInput
placeholder="Search projects..."
style={styles.search}
value={search}
onChangeText={setSearch}
/>

<View style={styles.tableHeader}>

<Text style={styles.headerCell}>
Project
</Text>

<Text style={styles.headerCell}>
Status
</Text>

<Text style={styles.headerCell}>
Investment
</Text>

<Text style={styles.headerCell}>
ROI
</Text>

</View>

{filteredProjects.map(project=>(

<View key={project.id} style={styles.row}>

<View style={{flex:2}}>

<Text style={styles.projectName}>
{project.name}
</Text>

<Text style={styles.projectDate}>
{project.date}
</Text>

</View>

<Text style={[
styles.status,
statusColor(project.status)
]}>
{project.status}
</Text>

<Text style={styles.cell}>
{project.investment}
</Text>

<Text style={styles.cell}>
{project.roi}
</Text>

</View>

))}

</View>

 //Status distribution 

<View style={styles.analyticsCard}>

<Text style={styles.sectionTitle}>
Project Status
</Text>

<View style={styles.statusRow}>

<View style={styles.statusItem}>
<Text style={styles.statusValue}>5</Text>
<Text style={styles.statusLabel}>Active</Text>
</View>

<View style={styles.statusItem}>
<Text style={styles.statusValue}>3</Text>
<Text style={styles.statusLabel}>Completed</Text>
</View>

<View style={styles.statusItem}>
<Text style={styles.statusValue}>4</Text>
<Text style={styles.statusLabel}>Upcoming</Text>
</View>

</View>

</View>

</ScrollView>

);

}

const statusColor = (status:any)=>{

switch(status){

case "Active":
return {color:"#059669"};

case "Completed":
return {color:"#2563eb"};

case "Upcoming":
return {color:"#d97706"};

default:
return {};

}

};

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f8fafc",
padding:20
},

title:{
fontSize:26,
fontWeight:"800",
marginBottom:20,
color:"#1e293b"
},

statsGrid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

statCard:{
width:"48%",
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginBottom:15,
elevation:3
},

statTitle:{
fontSize:13,
color:"#64748b"
},

statValue:{
fontSize:22,
fontWeight:"700",
marginVertical:5
},

statChange:{
fontSize:12,
color:"#059669"
},

chartCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginBottom:20
},

sectionTitle:{
fontSize:18,
fontWeight:"700",
marginBottom:10
},

tableCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginBottom:20
},

search:{
backgroundColor:"#f1f5f9",
padding:10,
borderRadius:8,
marginBottom:10
},

tableHeader:{
flexDirection:"row",
borderBottomWidth:1,
borderColor:"#e2e8f0",
paddingBottom:6
},

headerCell:{
flex:1,
fontWeight:"600",
color:"#64748b",
fontSize:12
},

row:{
flexDirection:"row",
alignItems:"center",
paddingVertical:12,
borderBottomWidth:1,
borderColor:"#f1f5f9"
},

projectName:{
fontWeight:"600"
},

projectDate:{
fontSize:11,
color:"#64748b"
},

status:{
flex:1,
fontWeight:"600"
},

cell:{
flex:1
},

analyticsCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14
},

statusRow:{
flexDirection:"row",
justifyContent:"space-between"
},

statusItem:{
alignItems:"center",
backgroundColor:"#f1f5f9",
padding:14,
borderRadius:10,
width:"30%"
},

statusValue:{
fontSize:20,
fontWeight:"700"
},

statusLabel:{
fontSize:12,
color:"#64748b"
}

});

*/

import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TextInput,
Dimensions,
useColorScheme
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";

import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {

const scheme = useColorScheme();
const isDark = scheme === "dark";

const colors = {
background: isDark ? "#0f172a" : "#f8fafc",
card: isDark ? "#1e293b" : "#ffffff",
text: isDark ? "#f1f5f9" : "#1e293b",
subText: isDark ? "#94a3b8" : "#64748b",
border: isDark ? "#334155" : "#e2e8f0",
input: isDark ? "#334155" : "#f1f5f9"
};

const [search,setSearch] = useState("");

const stats = [
{title:"Total Projects",value:"12",change:"+5%"},
{title:"Active Investments",value:"$230k",change:"+12%"},
{title:"Total ROI",value:"18%",change:"+3%"},
{title:"Active Investors",value:"45",change:"+7%"},
];

const projects = [

{
id:1,
name:"AI Marketing Platform",
date:"Started 2 days ago",
status:"Active",
investment:"$200,000",
roi:"15%"
},

{
id:2,
name:"Blockchain Payment System",
date:"Started 5 days ago",
status:"Completed",
investment:"$500,000",
roi:"22%"
},

{
id:3,
name:"Smart Home Automation",
date:"Starting next week",
status:"Upcoming",
investment:"$180,000",
roi:"12%"
}

];

const chartData = {

labels:["Jan","Feb","Mar","Apr","May","Jun"],

datasets:[
{
data:[1000,2500,2000,3500,4200,5000]
}
]

};

const filteredProjects = projects.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase())
);

return(
<>
<Header/>
<ScrollView style={[styles.container,{backgroundColor:colors.background}]}>

<Text style={[styles.title,{color:colors.text}]}>
Project Dashboard
</Text>

<View style={styles.statsGrid}>

{stats.map((item,index)=>(

<View key={index} style={[styles.statCard,{backgroundColor:colors.card}]}>

<Text style={[styles.statTitle,{color:colors.subText}]}>
{item.title}
</Text>

<Text style={[styles.statValue,{color:colors.text}]}>
{item.value}
</Text>

<Text style={styles.statChange}>
{item.change} from last month
</Text>

</View>

))}

</View>

<View style={[styles.chartCard,{backgroundColor:colors.card}]}>

<Text style={[styles.sectionTitle,{color:colors.text}]}>
Investment Analytics
</Text>

<LineChart
data={chartData}
width={screenWidth-40}
height={220}
bezier
chartConfig={{

backgroundGradientFrom:colors.card,
backgroundGradientTo:colors.card,

decimalPlaces:0,

color:(opacity=1)=>`rgba(79,70,229,${opacity})`,

labelColor:()=>colors.subText,

propsForDots:{
r:"5",
strokeWidth:"2",
stroke:"#4f46e5"
}

}}
style={{borderRadius:16}}
/>

</View>

<View style={[styles.tableCard,{backgroundColor:colors.card}]}>

<Text style={[styles.sectionTitle,{color:colors.text}]}>
Recent Projects
</Text>

<TextInput
placeholder="Search projects..."
placeholderTextColor={colors.subText}
style={[styles.search,{backgroundColor:colors.input,color:colors.text}]}
value={search}
onChangeText={setSearch}
/>

<View style={[styles.tableHeader,{borderColor:colors.border}]}>

<Text style={[styles.headerCell,{color:colors.subText}]}>
Project
</Text>

<Text style={[styles.headerCell,{color:colors.subText}]}>
Status
</Text>

<Text style={[styles.headerCell,{color:colors.subText}]}>
Investment
</Text>

<Text style={[styles.headerCell,{color:colors.subText}]}>
ROI
</Text>

</View>

{filteredProjects.map(project=>(

<View key={project.id} style={[styles.row,{borderColor:colors.border}]}>

<View style={{flex:2}}>

<Text style={[styles.projectName,{color:colors.text}]}>
{project.name}
</Text>

<Text style={[styles.projectDate,{color:colors.subText}]}>
{project.date}
</Text>

</View>

<Text style={[
styles.status,
statusColor(project.status)
]}>
{project.status}
</Text>

<Text style={[styles.cell,{color:colors.text}]}>
{project.investment}
</Text>

<Text style={[styles.cell,{color:colors.text}]}>
{project.roi}
</Text>

</View>

))}

</View>

<View style={[styles.analyticsCard,{backgroundColor:colors.card}]}>

<Text style={[styles.sectionTitle,{color:colors.text}]}>
Project Status
</Text>

<View style={styles.statusRow}>

<View style={[styles.statusItem,{backgroundColor:colors.input}]}>
<Text style={[styles.statusValue,{color:colors.text}]}>5</Text>
<Text style={[styles.statusLabel,{color:colors.subText}]}>Active</Text>
</View>

<View style={[styles.statusItem,{backgroundColor:colors.input}]}>
<Text style={[styles.statusValue,{color:colors.text}]}>3</Text>
<Text style={[styles.statusLabel,{color:colors.subText}]}>Completed</Text>
</View>

<View style={[styles.statusItem,{backgroundColor:colors.input}]}>
<Text style={[styles.statusValue,{color:colors.text}]}>4</Text>
<Text style={[styles.statusLabel,{color:colors.subText}]}>Upcoming</Text>
</View>

</View>

</View>
<Footer/>

</ScrollView>
</>

);

}

const statusColor = (status:any)=>{

switch(status){

case "Active":
return {color:"#059669"};

case "Completed":
return {color:"#2563eb"};

case "Upcoming":
return {color:"#d97706"};

default:
return {};

}

};

const styles = StyleSheet.create({

container:{
flex:1,
padding:20
},

title:{
fontSize:26,
fontWeight:"800",
marginBottom:20
},

statsGrid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

statCard:{
width:"48%",
padding:16,
borderRadius:14,
marginBottom:15,
elevation:3
},

statTitle:{
fontSize:13
},

statValue:{
fontSize:22,
fontWeight:"700",
marginVertical:5
},

statChange:{
fontSize:12,
color:"#059669"
},

chartCard:{
padding:16,
borderRadius:14,
marginBottom:20
},

sectionTitle:{
fontSize:18,
fontWeight:"700",
marginBottom:10
},

tableCard:{
padding:16,
borderRadius:14,
marginBottom:20
},

search:{
padding:10,
borderRadius:8,
marginBottom:10
},

tableHeader:{
flexDirection:"row",
borderBottomWidth:1,
paddingBottom:6
},

headerCell:{
flex:1,
fontWeight:"600",
fontSize:12
},

row:{
flexDirection:"row",
alignItems:"center",
paddingVertical:12,
borderBottomWidth:1
},

projectName:{
fontWeight:"600"
},

projectDate:{
fontSize:11
},

status:{
flex:1,
fontWeight:"600"
},

cell:{
flex:1
},

analyticsCard:{
padding:16,
borderRadius:14
},

statusRow:{
flexDirection:"row",
justifyContent:"space-between"
},

statusItem:{
alignItems:"center",
padding:14,
borderRadius:10,
width:"30%"
},

statusValue:{
fontSize:20,
fontWeight:"700"
},

statusLabel:{
fontSize:12
}

});