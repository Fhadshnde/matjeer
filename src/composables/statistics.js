export const fetchStatisticsFunc = async() => {
    if(import.meta.client){

let token=localStorage.getItem('token')
console.log(token)
try{
let result=await $fetch('https://products-api.cbc-apps.net/statistics',{
  headers:{
  authorization:`Bearer ${token}`
  }
})
  console.log(result)

return result
}catch(e){
return console.log(e)
}
}
}
