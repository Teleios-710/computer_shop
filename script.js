const slides=[{img:'img/hero-reading.jpg',eyebrow:'NEXTECH · BUILD YOUR EDGE',title:'성능을 설계하고<br><em>한계를 새로 쓰다.</em>',desc:'엄선한 PC 부품과 게이밍 기어.<br>당신만의 완벽한 셋업을 완성하세요.'},{img:'img/hero-books.jpg',eyebrow:'POWER YOUR NEXT BUILD',title:'작은 부품 하나로<br><em>달라지는 퍼포먼스.</em>',desc:'꼼꼼하게 비교하고 자신 있게 선택하세요.<br>검증된 하드웨어를 한곳에서 만나보세요.'},{img:'img/hero-library.jpg',eyebrow:'MADE FOR YOUR PLAY',title:'매 프레임을 위한<br><em>완벽한 밸런스.</em>',desc:'게임부터 크리에이티브 작업까지.<br>목적에 맞는 최고의 조합을 찾아드립니다.'},{img:'img/hero-coffee.jpg',eyebrow:'CLEAN SETUP, CLEAR MIND',title:'당신의 책상 위에<br><em>새로운 가능성을.</em>',desc:'감각적인 주변기기와 모니터로<br>매일 앉고 싶은 셋업을 완성해 보세요.'},{img:'img/feature-reader.jpg',eyebrow:'BUILD IT YOUR WAY',title:'처음 조립부터<br><em>나만의 완성까지.</em>',desc:'초보도 안심할 수 있는 부품 가이드.<br>호환성부터 배송까지 넥스테크가 함께합니다.'}];
let selectedCategory='',searchTerm='',cart=[],points=0,member=false,slideIndex=0,productRequest=0,checkoutSubtotal=0,checkoutShipping=0;
const won=n=>new Intl.NumberFormat('ko-KR').format(Number(n)||0)+'원';
(function(){
if(!document.getElementById('bookGrid'))return;
const productColumns='id,name,category,price,stock,image_url,is_active,created_at';
const fallbackProductImage='img/feature-reader.jpg';
async function loadCategories(){
  const {data,error}=await db.from('shop_products').select('category').eq('is_active',true).order('id',{ascending:true});
  if(error){console.error(error.message);return}
  const categories=[...new Set((data||[]).map(row=>row.category).filter(Boolean))];
  const tabs=document.getElementById('categoryTabs');
  tabs.innerHTML='<button class="tab active" data-category="">전체</button>'+categories.map(category=>`<button class="tab" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  tabs.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
    selectedCategory=button.dataset.category||'';
    tabs.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab===button));
    renderProducts();
  }));
}
function renderProductCard(product){
  const soldOut=Number(product.stock)===0;
  const image=product.image_url&&String(product.image_url).trim()?String(product.image_url).trim():fallbackProductImage;
  return `<article class="book-card">
    <div class="cover" data-detail-id="${escapeHtml(product.id)}">
      <span class="tag">${escapeHtml(product.category||'상품')}</span>
      <button class="like" type="button" aria-label="관심 상품">♡</button>
      <img class="product-image" src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" onerror="this.onerror=null;this.src='${fallbackProductImage}'">
    </div>
    <div class="book-meta">${escapeHtml(product.category||'기타')}</div>
    <div class="book-title">${escapeHtml(product.name)}</div>
    <div class="price-row"><span class="price">${won(product.price)}</span></div>
    <div class="points ${soldOut?'sold-out':''}">${soldOut?'품절':`재고 ${Number(product.stock)||0}개`}</div>
    <button class="primary product-add" type="button" data-add-id="${escapeHtml(product.id)}" ${soldOut?'disabled':''}>${soldOut?'품절':'장바구니 담기'}</button>
  </article>`;
}
async function renderProducts(){
  const requestId=++productRequest;
  const grid=document.getElementById('bookGrid');
  grid.innerHTML='<div class="empty">불러오는 중</div>';
  let request=db.from('shop_products').select(productColumns).eq('is_active',true).order('id',{ascending:true});
  if(selectedCategory)request=request.eq('category',selectedCategory);
  if(searchTerm.trim())request=request.ilike('name',`%${searchTerm.trim()}%`);
  const {data,error}=await request;
  if(requestId!==productRequest)return;
  if(error){console.error(error.message);grid.innerHTML='<div class="empty">상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>';return}
  if(!data||data.length===0){grid.innerHTML='<div class="empty">상품이 없습니다</div>';return}
  grid.innerHTML=data.map(renderProductCard).join('');
  grid.querySelectorAll('[data-detail-id]').forEach(card=>card.addEventListener('click',()=>preview(card.dataset.detailId)));
  grid.querySelectorAll('.like').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();button.classList.toggle('on');button.textContent=button.classList.contains('on')?'♥':'♡'}));
  grid.querySelectorAll('[data-add-id]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();addCart(button.dataset.addId)}));
}
function setFilter(category=''){
  const tabs=[...document.querySelectorAll('#categoryTabs [data-category]')];
  selectedCategory=tabs.some(tab=>tab.dataset.category===category)?category:'';
  tabs.forEach(tab=>tab.classList.toggle('active',(tab.dataset.category||'')===selectedCategory));
  renderProducts();
}
let searchTimer;
document.getElementById('searchInput').addEventListener('input',event=>{
  searchTerm=event.target.value;
  clearTimeout(searchTimer);
  searchTimer=setTimeout(renderProducts,250);
});
function slideTo(i){slideIndex=(i+slides.length)%slides.length;let s=slides[slideIndex],im=document.getElementById('heroImage');im.style.opacity=0;setTimeout(()=>{im.style.backgroundImage=`url('${s.img}')`;document.getElementById('heroEyebrow').textContent=s.eyebrow;document.getElementById('heroTitle').innerHTML=s.title;document.getElementById('heroDesc').innerHTML=s.desc;im.style.opacity=1;document.getElementById('heroNum').textContent=String(slideIndex+1).padStart(2,'0')},250);document.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('active',j===slideIndex))}document.getElementById('heroDots').innerHTML=slides.map((_,i)=>`<button class="dot ${i===0?'active':''}" aria-label="슬라이드 ${i+1}" onclick="slideTo(${i})"></button>`).join('');document.getElementById('heroImage').style.backgroundImage=`url('${slides[0].img}')`;setInterval(()=>slideTo(slideIndex+1),5500);
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
let currentUser=null,currentProfile=null;
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function displayName(){return currentProfile?.name||currentUser?.user_metadata?.name||currentUser?.email?.split('@')[0]||'회원'}
function showAuthMenu(){
  const menu=document.getElementById('authMenu');
  if(!menu)return;
  if(!currentUser){menu.innerHTML='<button class="login-btn" id="loginOpen">로그인 · 회원가입</button>';document.getElementById('loginOpen').onclick=()=>openModal('loginModal');return}
  const adminLink=currentProfile?.role==='admin'?'<a class="auth-link admin-nav-link" href="./admin.html">관리</a>':'';
  menu.innerHTML=`<button class="auth-link" id="mypageOpen">${escapeHtml(displayName())} 님</button><span class="auth-separator">·</span><button class="auth-link" id="logoutOpen">로그아웃</button>${adminLink}`;
  document.getElementById('mypageOpen').onclick=openMyPage;
  document.getElementById('logoutOpen').onclick=logout;
}
function authErrorMessage(error){
  const message=String(error?.message||'').toLowerCase();
  if(message.includes('already registered')||message.includes('already been registered'))return '이미 가입된 이메일입니다. 로그인해 주세요.';
  if(message.includes('invalid login credentials')||message.includes('invalid_credentials'))return '이메일 또는 비밀번호가 올바르지 않습니다.';
  if(message.includes('email not confirmed'))return '이메일 인증을 완료한 뒤 로그인해 주세요.';
  if(message.includes('password')&&(message.includes('weak')||message.includes('short')||message.includes('at least')))return '비밀번호는 6자 이상 입력해 주세요.';
  return '요청을 처리하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.';
}
async function loadProfile(user){
  const {data,error}=await db.from('shop_profiles').select('id,email,name,phone,grade,points,role').eq('id',user.id).maybeSingle();
  if(error)throw error;
  currentProfile=data;
  member=true;
  points=Number(data?.points??0);
  showAuthMenu();
  return data;
}
async function initializeAuth(){
  try{
    const {data,error}=await db.auth.getSession();
    if(error)throw error;
    currentUser=data.session?.user??null;
    member=Boolean(currentUser);
    if(currentUser){try{await loadProfile(currentUser)}catch(error){console.error(error.message);showAuthMenu()}}
    else{currentProfile=null;points=0;showAuthMenu()}
  }catch(error){console.error(error.message);currentUser=null;currentProfile=null;member=false;points=0;showAuthMenu()}
}
async function loadOrderHistory(userId){
  const container=document.getElementById('orderHistory');
  container.innerHTML='<p class="empty">주문 내역을 불러오는 중</p>';
  const {data:orders,error:ordersError}=await db.from('shop_orders').select('id,total,status,created_at').eq('user_id',userId).order('created_at',{ascending:false});
  if(ordersError){container.innerHTML=`<p class="empty">주문 내역을 불러오지 못했습니다: ${escapeHtml(ordersError.message)}</p>`;return}
  if(!orders||orders.length===0){container.innerHTML='<p class="empty">아직 주문 내역이 없습니다.</p>';return}
  const orderIds=orders.map(order=>order.id);
  const {data:items,error:itemsError}=await db.from('shop_order_items').select('order_id,product_id,qty,unit_price').in('order_id',orderIds);
  if(itemsError){container.innerHTML=`<p class="empty">주문 상품을 불러오지 못했습니다: ${escapeHtml(itemsError.message)}</p>`;return}
  const productIds=[...new Set((items||[]).map(item=>String(item.product_id)))];
  let productsById=new Map();
  if(productIds.length){
    const {data:products,error:productsError}=await db.from('shop_products').select('id,name').in('id',productIds);
    if(productsError)console.error(productsError.message);
    productsById=new Map((products||[]).map(product=>[String(product.id),product.name]));
  }
  const itemsByOrder=new Map();
  (items||[]).forEach(item=>{const key=String(item.order_id);if(!itemsByOrder.has(key))itemsByOrder.set(key,[]);itemsByOrder.get(key).push(item)});
  container.innerHTML=orders.map(order=>{
    const date=new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(order.created_at));
    const orderItems=itemsByOrder.get(String(order.id))||[];
    const names=orderItems.length?orderItems.map(item=>`<li>${escapeHtml(productsById.get(String(item.product_id))||`상품 #${item.product_id}`)} <span>× ${Number(item.qty)}</span></li>`).join(''):'<li>주문 상품 정보가 없습니다.</li>';
    return `<article class="order-card"><div class="order-heading"><strong>주문 번호 ${escapeHtml(order.id)}</strong><span>${escapeHtml(date)}</span></div><div class="order-total"><b>${won(order.total)}</b><span>${escapeHtml(order.status||'')}</span></div><ul>${names}</ul></article>`;
  }).join('');
}
async function openMyPage(){
  try{
    const {data,error}=await db.auth.getSession();
    if(error)throw error;
    const user=data.session?.user;
    if(!user){closeModal('mypageModal');toast('마이페이지는 로그인 후 이용할 수 있어요.');openModal('loginModal');return}
    currentUser=user;
    const profile=await loadProfile(user);
    if(!profile){toast('회원 정보를 찾을 수 없습니다. 잠시 후 다시 시도해 주세요.');return}
    document.getElementById('profileName').value=profile.name??'';
    document.getElementById('profileEmail').value=profile.email??user.email??'';
    document.getElementById('profilePhone').value=profile.phone??'';
    const gradeNames={WELCOME:'스타터',SILVER:'빌더',GOLD:'퍼포머',VIP:'마스터'};
    document.getElementById('profileGrade').textContent=gradeNames[profile.grade]??profile.grade??'-';
    document.getElementById('profilePoints').textContent=`${Number(profile.points??0).toLocaleString()}P`;
    openModal('mypageModal');await loadOrderHistory(user.id);
  }catch(error){toast(`회원 정보를 불러오지 못했습니다: ${error.message}`)}
}
async function logout(){
  const {error}=await db.auth.signOut();
  if(error){toast(authErrorMessage(error));return}
  currentUser=null;currentProfile=null;member=false;points=0;showAuthMenu();closeModal('mypageModal');toast('로그아웃했습니다.');
}
document.getElementById('loginOpen').onclick=()=>openModal('loginModal');
document.querySelectorAll('.modal-backdrop').forEach(x=>x.addEventListener('click',e=>{if(e.target===x)x.classList.remove('open')}));
document.getElementById('signupForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const name=document.getElementById('signupName').value.trim();
  const phone=document.getElementById('signupPhone').value.trim();
  const email=e.currentTarget.querySelector('input[type="email"]').value.trim();
  const password=document.getElementById('signupPassword').value;
  if(password.length<6){toast('비밀번호는 6자 이상 입력해 주세요.');return}
  const {data,error}=await db.auth.signUp({email,password,options:{data:{name,phone}}});
  if(error){toast(authErrorMessage(error));return}
  if(data.user&&Array.isArray(data.user.identities)&&data.user.identities.length===0){toast('이미 가입된 이메일입니다. 로그인해 주세요.');return}
  if(data.session){
    const {error:signOutError}=await db.auth.signOut();
    if(signOutError){toast(`가입은 완료됐지만 로그인 화면으로 이동하지 못했습니다: ${signOutError.message}`);return}
  }
  currentUser=null;currentProfile=null;member=false;points=0;showAuthMenu();
  closeModal('signupModal');openModal('loginModal');
  toast(data.session?'가입이 완료됐어요. 로그인해 주세요.':'가입 확인 메일을 인증한 뒤 로그인해 주세요.');
});
document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value.trim();
  const password=document.getElementById('loginPassword').value;
  const {data,error}=await db.auth.signInWithPassword({email,password});
  if(error){toast(authErrorMessage(error));return}
  currentUser=data.user;
  try{await loadProfile(data.user)}catch(profileError){console.error(profileError.message);showAuthMenu()}
  closeModal('loginModal');toast('로그인했습니다. 환영합니다!');
});
document.getElementById('profileForm').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!currentUser){closeModal('mypageModal');openModal('loginModal');return}
  const name=document.getElementById('profileName').value.trim();
  const phone=document.getElementById('profilePhone').value.trim();
  const {error}=await db.from('shop_profiles').update({name,phone}).eq('id',currentUser.id);
  if(error){toast(`회원 정보 저장에 실패했습니다: ${error.message}`);return}
  currentProfile={...currentProfile,name,phone};
  showAuthMenu();
  toast('이름과 연락처를 저장했습니다.');
});
function addCart(id){cart.push(id);renderCart();toast('장바구니에 담았어요.')}
async function renderCart(){
  document.getElementById('cartCount').textContent=cart.length;
  document.getElementById('drawerCount').textContent=cart.length;
  if(!cart.length){document.getElementById('cartItems').innerHTML='<p style="text-align:center;color:#8990a0;padding:60px 0;font-size:12px">장바구니가 비어 있어요.</p>';document.getElementById('cartBottom').innerHTML='';return}
  document.getElementById('cartItems').innerHTML='<p style="text-align:center;color:#8990a0;padding:30px 0;font-size:12px">불러오는 중</p>';
  const {data,error}=await db.from('shop_products').select(productColumns).in('id',cart).eq('is_active',true);
  if(error){console.error(error.message);document.getElementById('cartItems').innerHTML='<p class="empty">장바구니 상품을 불러오지 못했습니다.</p>';return}
  const byId=new Map((data||[]).map(product=>[String(product.id),product]));
  document.getElementById('cartItems').innerHTML=cart.map((id,index)=>{
    const product=byId.get(String(id));
    if(!product)return `<div class="cart-row"><div><strong>상품 정보를 찾을 수 없습니다.</strong></div><button class="remove" onclick="removeCart(${index})">×</button></div>`;
    const image=product.image_url&&String(product.image_url).trim()?String(product.image_url).trim():fallbackProductImage;
    return `<div class="cart-row"><img class="mini-cover" src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" onerror="this.onerror=null;this.src='${fallbackProductImage}'"><div><strong>${escapeHtml(product.name)}</strong><small>${won(product.price)} · ${Number(product.stock)===0?'품절':`재고 ${Number(product.stock)||0}개`}</small></div><button class="remove" onclick="removeCart(${index})">×</button></div>`;
  }).join('');
  const subtotal=cart.reduce((sum,id)=>sum+(Number(byId.get(String(id))?.price)||0),0);
  document.getElementById('cartBottom').innerHTML=`<div class="drawer-total"><span>총 상품 금액</span><b>${won(subtotal)}</b></div><button class="primary full" onclick="checkout()">주문하기</button>`;
}
function removeCart(index){cart.splice(index,1);renderCart()}
document.getElementById('cartOpen').onclick=()=>{renderCart();document.getElementById('cartDrawer').classList.add('open')};
function closeCart(){document.getElementById('cartDrawer').classList.remove('open')}
document.getElementById('cartDrawer').addEventListener('click',event=>{if(event.target.id==='cartDrawer')closeCart()});
function orderLinesFromCart(products){
  const quantities=new Map();
  cart.forEach(id=>{const key=String(id);const row=quantities.get(key);quantities.set(key,{productId:id,qty:(row?.qty||0)+1})});
  const productById=new Map(products.map(product=>[String(product.id),product]));
  return [...quantities.values()].map(({productId,qty})=>({product:productById.get(String(productId)),productId,qty}));
}
function expectedPoints(total){
  const rate={WELCOME:.01,SILVER:.03,GOLD:.05,VIP:.07}[currentProfile?.grade]??.01;
  return Math.floor(total*rate);
}
async function checkout(){
  closeCart();
  if(!cart.length)return;
  document.getElementById('checkoutItems').innerHTML='<p class="empty">불러오는 중</p>';
  openModal('checkoutModal');
  const ids=[...new Set(cart.map(String))];
  const {data,error}=await db.from('shop_products').select(productColumns).in('id',ids).eq('is_active',true);
  if(error){document.getElementById('checkoutItems').innerHTML=`<p class="empty">상품을 불러오지 못했습니다: ${escapeHtml(error.message)}</p>`;return}
  const lines=orderLinesFromCart(data||[]);
  if(lines.some(line=>!line.product)){document.getElementById('checkoutItems').innerHTML='<p class="empty">장바구니 상품 중 판매 중인 상품을 찾지 못했습니다.</p>';return}
  checkoutSubtotal=lines.reduce((sum,line)=>sum+line.qty*Number(line.product.price),0);
  document.getElementById('checkoutItems').innerHTML=lines.map(line=>`<div class="checkout-item"><span>${escapeHtml(line.product.name)} <small>× ${line.qty}</small></span><b>${won(Number(line.product.price)*line.qty)}</b></div>`).join('');
  document.getElementById('subtotal').textContent=won(checkoutSubtotal);
  document.getElementById('expectedPoints').textContent=`적립 예정 ${expectedPoints(checkoutSubtotal).toLocaleString()}P`;
  document.getElementById('total').textContent=won(checkoutSubtotal);
}
async function placeOrder(){
  const button=document.getElementById('placeOrderButton');
  if(button){button.disabled=true;button.textContent='주문 저장 중'}
  try{
    const {data:sessionData,error:sessionError}=await db.auth.getSession();
    if(sessionError)throw sessionError;
    if(!sessionData.session?.user){closeModal('checkoutModal');openModal('loginModal');toast('결제를 체험하려면 먼저 로그인해 주세요.');return}
    if(!cart.length){toast('장바구니가 비어 있어요.');return}
    const ids=[...new Set(cart.map(String))];
    const {data:products,error:productsError}=await db.from('shop_products').select(productColumns).in('id',ids).eq('is_active',true);
    if(productsError)throw productsError;
    const lines=orderLinesFromCart(products||[]);
    if(lines.length===0||lines.some(line=>!line.product))throw new Error('장바구니 상품을 찾을 수 없습니다. 다시 담아 주세요.');
    const unavailable=lines.find(line=>Number(line.product.stock)<=0||Number(line.product.stock)<line.qty);
    if(unavailable)throw new Error(`${unavailable.product.name} 상품의 재고가 부족합니다.`);
    const orderItems=lines.map(line=>({productId:line.product.id,qty:line.qty,unitPrice:Number(line.product.price)}));
    const total=lines.reduce((sum,line)=>sum+line.qty*Number(line.product.price),0);
    const detailTotal=orderItems.reduce((sum,item)=>sum+item.qty*item.unitPrice,0);
    if(detailTotal!==total)throw new Error('주문 금액 계산이 일치하지 않습니다.');
    const {data:order,error:orderError}=await db.from('shop_orders').insert({total}).select().single();
    if(orderError)throw orderError;
    const rows=orderItems.map(item=>({order_id:order.id,product_id:item.productId,qty:item.qty,unit_price:item.unitPrice}));
    const {error:itemsError}=await db.from('shop_order_items').insert(rows);
    if(itemsError)throw itemsError;
    cart=[];
    renderCart();
    closeModal('checkoutModal');
    document.getElementById('completedOrderId').textContent=String(order.id);
    document.getElementById('completedOrderTotal').textContent=won(total);
    document.getElementById('completedPoints').textContent=`적립 예정 ${expectedPoints(total).toLocaleString()}P`;
    openModal('orderCompleteModal');
  }catch(error){toast(`주문 저장에 실패했습니다: ${error.message}`)}
  finally{if(button){button.disabled=false;button.textContent='체험 결제'}}
}
async function preview(id){
  activeDetailId=id;
  document.getElementById('readerTitle').textContent='불러오는 중';
  document.getElementById('detailCategory').textContent='';
  document.getElementById('detailPrice').textContent='';
  document.getElementById('detailStock').textContent='';
  document.getElementById('detailImage').src=fallbackProductImage;
  const button=document.getElementById('detailAddButton');button.disabled=true;button.textContent='불러오는 중';
  openModal('readerModal');
  const {data,error}=await db.from('shop_products').select(productColumns).eq('id',id).eq('is_active',true).single();
  if(error){console.error(error.message);document.getElementById('readerTitle').textContent='상품을 찾을 수 없습니다';button.textContent='상품을 찾을 수 없습니다';return}
  document.getElementById('readerTitle').textContent=data.name;
  document.getElementById('detailCategory').textContent=data.category||'상품';
  document.getElementById('detailPrice').textContent=won(data.price);
  const soldOut=Number(data.stock)===0;
  document.getElementById('detailStock').textContent=soldOut?'품절':`재고 ${Number(data.stock)||0}개`;
  document.getElementById('detailStock').classList.toggle('sold-out',soldOut);
  document.getElementById('detailImage').src=data.image_url&&String(data.image_url).trim()?data.image_url:fallbackProductImage;
  button.disabled=soldOut;button.textContent=soldOut?'품절':'장바구니 담기';
  button.onclick=()=>{addCart(data.id);closeModal('readerModal')};
}
let toastTimer;function toast(msg){let el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();toast('구독 신청이 완료됐어요. 신제품 소식을 보내드릴게요!');e.target.reset()});loadCategories();renderProducts();
async function checkSupabaseConnection() {
  try {
    const { count, error } = await db
      .from('shop_products')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log(`연결 성공: 상품 ${count ?? 0}개`);
  } catch (error) {
    console.error(error?.message ?? error);
  }
}

checkSupabaseConnection();
initializeAuth();
Object.assign(window,{openModal,closeModal,openMyPage,placeOrder,closeCart,setFilter,addCart,checkout,removeCart,preview,slideTo});
})();



