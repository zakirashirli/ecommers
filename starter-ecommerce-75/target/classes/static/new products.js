document.addEventListener('DOMContentLoaded',()=>{
  if(StoreApi.user()?.role!=='SELLER'){alert('Seller account required');location.href='shop.html';return;}
  const image=document.getElementById('image');
  const preview=document.getElementById('preview');
  const previewContainer=document.getElementById('previewContainer');
  const productForm=document.getElementById('productForm');
  image.addEventListener('change',()=>{const f=image.files[0];if(f){preview.src=URL.createObjectURL(f);previewContainer.style.display='block';}});
  productForm.addEventListener('submit',async e=>{e.preventDefault();try{const uploaded=await StoreApi.upload(image.files[0]);const body=productBody(uploaded.url);await StoreApi.request('/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});alert('Product saved');location.href='user products.html';}catch(error){alert(error.message);}});
});
function productBody(imageUrl){
  const value=id=>document.getElementById(id).value;
  return{brand:value('brand').trim(),model:value('model').trim(),category:value('category').trim(),description:value('description').trim(),price:Number(value('price')),rating:Number(value('rating')),imageUrl};
}
