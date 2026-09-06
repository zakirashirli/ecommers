let editing;
document.addEventListener('DOMContentLoaded',async()=>{
  if(StoreApi.user()?.role!=='SELLER'){location.href='shop.html';return;}const id=new URLSearchParams(location.search).get('id');if(!id){location.href='user products.html';return;}
  try{editing=await StoreApi.product(id);brand.value=editing.brand;model.value=editing.model;category.value=editing.category;description.value=editing.description;price.value=editing.price;rating.value=editing.rating;preview.src=editing.imageUrl;previewContainer.style.display='block';}catch(e){alert(e.message);return;}
  image.addEventListener('change',()=>{if(image.files[0])preview.src=URL.createObjectURL(image.files[0]);});
  editForm.addEventListener('submit',async e=>{e.preventDefault();try{let imageUrl=editing.imageUrl;if(image.files[0])imageUrl=(await StoreApi.upload(image.files[0])).url;const body={brand:brand.value.trim(),model:model.value.trim(),category:category.value.trim(),description:description.value.trim(),price:Number(price.value),rating:Number(rating.value),imageUrl};await StoreApi.request(`/api/products/${editing.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});alert('Product updated');location.href='user products.html';}catch(error){alert(error.message);}});
});
