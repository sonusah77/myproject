let inventory=[];
let suppliers=[];
let orders=[];

let products=[
"Laptop","Phone","Keyboard","Mouse","Monitor",
"Printer","Tablet","Router","SSD","Hard Drive",
"Camera","Headphones","Speaker","Projector","Microphone",
"Smartwatch","Drone","Scanner","GPU","RAM"
];

for(let i=0;i<products.length;i++){

inventory.push({
id:i+1,
name:products[i],
qty:Math.floor(Math.random()*200)+50,
supplier:"Supplier "+(i%10+1)
});

}

for(let i=1;i<=10;i++){

suppliers.push({
id:i,
name:"Supplier "+i,
email:"supplier"+i+"@company.com",
phone:"90000000"+i
});

}

for(let i=1;i<=120;i++){

let product=products[Math.floor(Math.random()*products.length)];
let qty=Math.floor(Math.random()*10)+1;

let statuses=["Pending","Processing","Delivered"];
let status=statuses[Math.floor(Math.random()*3)];

orders.push({
id:i,
product:product,
qty:qty,
status:status
});

let item=inventory.find(p=>p.name===product);
if(item){
item.qty-=qty;
}

}

function login(){

let u=document.getElementById("username").value;
let p=document.getElementById("password").value;

if(u==="admin" && p==="admin123"){

document.getElementById("loginPage").style.display="none";
document.getElementById("system").style.display="block";

updateDashboard();

}else{

document.getElementById("loginError").innerText="Invalid login";

}

}

function toggleDark(){
document.body.classList.toggle("dark");
}

function show(id){

document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");

}

function updateDashboard(){

document.getElementById("productCount").innerText=inventory.length;
document.getElementById("orderCount").innerText=orders.length;
document.getElementById("supplierCount").innerText=suppliers.length;

checkLowStock();

renderInventory();
renderOrders();
renderSuppliers();

createCharts();

}

function checkLowStock(){

let low=inventory.filter(p=>p.qty<20);
document.getElementById("lowStockCount").innerText=low.length;

}

function renderInventory(){

let table=document.getElementById("inventoryTable");
table.innerHTML="";

inventory.forEach((p,i)=>{

table.innerHTML+=`

<tr>
<td>${p.id}</td>
<td>${p.name}</td>
<td>${p.qty}</td>
<td>${p.supplier}</td>
<td><button onclick="deleteProduct(${i})">Delete</button></td>
</tr>

`;

});

}

function addProduct(){

let name=document.getElementById("productName").value;
let qty=parseInt(document.getElementById("productQty").value);
let supplier=document.getElementById("productSupplier").value;

inventory.push({
id:inventory.length+1,
name:name,
qty:qty,
supplier:supplier
});

updateDashboard();

}

function scanBarcode(){

let code=document.getElementById("barcodeInput").value;

inventory.push({
id:inventory.length+1,
name:"Barcode-"+code,
qty:50,
supplier:"Barcode Supplier"
});

updateDashboard();

}

function deleteProduct(i){

inventory.splice(i,1);
updateDashboard();

}

function searchInventory(){

let term=document.getElementById("searchProduct").value.toLowerCase();

document.querySelectorAll("#inventoryTable tr").forEach(r=>{
r.style.display=r.innerText.toLowerCase().includes(term)?"":"none";
});

}

function orderTimeline(status){

if(status==="Pending") return "Order Created";
if(status==="Processing") return "Processing → Packaging";
if(status==="Delivered") return "Processing → Shipped → Delivered";

}

function renderOrders(){

let table=document.getElementById("ordersTable");

table.innerHTML="";

orders.forEach(o=>{

table.innerHTML+=`

<tr>
<td>${o.id}</td>
<td>${o.product}</td>
<td>${o.qty}</td>
<td>${o.status}</td>
<td>${orderTimeline(o.status)}</td>
</tr>

`;

});

}

function renderSuppliers(){

let table=document.getElementById("supplierTable");

table.innerHTML="";

suppliers.forEach(s=>{

table.innerHTML+=`

<tr>
<td>${s.id}</td>
<td>${s.name}</td>
<td>${s.email}</td>
<td>${s.phone}</td>
</tr>

`;

});

}

function createCharts(){

new Chart(document.getElementById("dashboardChart"),{
type:"bar",
data:{
labels:["Products","Orders","Suppliers"],
datasets:[{
label:"System Overview",
data:[inventory.length,orders.length,suppliers.length]
}]
}
});

new Chart(document.getElementById("inventoryChart"),{
type:"pie",
data:{
labels:inventory.map(p=>p.name),
datasets:[{data:inventory.map(p=>p.qty)}]
}
});

new Chart(document.getElementById("forecastChart"),{
type:"line",
data:{
labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
datasets:[{
label:"Predicted Demand",
data:[120,150,180,200,220,250,270,300,320,350,380,420]
}]
}
});

}

function exportExcel(){

let csv="Product,Quantity,Supplier\n";

inventory.forEach(p=>{
csv+=`${p.name},${p.qty},${p.supplier}\n`;
});

let blob=new Blob([csv]);

let link=document.createElement("a");

link.href=URL.createObjectURL(blob);
link.download="inventory.csv";
link.click();

}

function exportPDF(){

const { jsPDF } = window.jspdf;

let doc=new jsPDF();

doc.text("Inventory Report",20,20);

let y=30;

inventory.forEach(p=>{
doc.text(`${p.name} Qty:${p.qty}`,20,y);
y+=10;
});

doc.save("inventory.pdf");

}