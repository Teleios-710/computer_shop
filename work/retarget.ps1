$path = 'index.html'
$html = Get-Content -Raw -Encoding UTF8 $path
$html = [regex]::Replace($html, ':root\{[^}]+\}', ':root{--navy:#080808;--blue:#151515;--ink:#181818;--muted:#777;--line:#e8e8e8;--pale:#f5f5f5;--gold:#c6c6c6}')
$html = $html.Replace('</style></head>', '.hero h1 em{color:#d0d0d0}.eyebrow,.kicker{color:#b8b8b8}.hero-image:after{background:linear-gradient(90deg,#090909 0%,#090909c9 20%,#09090920 72%,#09090920)}.hero-box{background:#090909}.primary,.logo-mark,.badge{background:#111}.primary:hover{background:#333}.banner:after{content:"TECH";color:#e7e7e7}.cover{background-size:cover;background-position:center}.cover-art{display:none}.tag{color:#111}.text-link,.points,.benefit-icon{color:#111}.stars,.discount{color:#555}.digital{background:#f5f5f5}.membership{background:#111}.tier.featured{background:#303030;border-color:#555}.step b{color:#111}.section-head .kicker{color:#333}.tab.active{background:#111;border-color:#111}.newsletter{background:#f4f4f4}.footer{background:#101010}</style></head>')
$html = [regex]::Replace($html, 'const products=\[.*?\];\r?\nconst slides=', @'
const products=[
{id:1,title:'GeForce RTX 5070 Ti 16GB',author:'NVIDIA · 그래픽카드',kind:'hardware',genre:'그래픽카드',price:1249000,old:1399000,colors:['#555','#111'],img:'hero-reading.jpg',cover:['NVIDIA','RTX 5070 Ti'],tag:'BEST'},
{id:2,title:'AMD Ryzen 7 9800X3D',author:'AMD · 데스크톱 프로세서',kind:'hardware',genre:'CPU',price:689000,old:729000,colors:['#555','#111'],img:'hero-library.jpg',cover:['AMD RYZEN','9800X3D'],tag:'게이밍 추천'},
{id:3,title:'ROG STRIX B850-F GAMING WIFI',author:'ASUS · ATX 메인보드',kind:'hardware',genre:'메인보드',price:459000,old:499000,colors:['#555','#111'],img:'hero-books.jpg',cover:['ASUS ROG','B850-F'],tag:'신제품'},
{id:4,title:'990 PRO NVMe M.2 2TB',author:'Samsung · PCIe 4.0 SSD',kind:'hardware',genre:'SSD',price:229000,old:259000,colors:['#555','#111'],img:'hero-coffee.jpg',cover:['SAMSUNG','990 PRO'],tag:'특가'},
{id:5,title:'G915 X LIGHTSPEED TKL',author:'Logitech · 무선 게이밍 키보드',kind:'peripheral',genre:'키보드',price:289000,old:319000,colors:['#555','#111'],img:'feature-reader.jpg',cover:['LOGITECH G','G915 X'],tag:'신제품'},
{id:6,title:'MAG CORELIQUID I360',author:'MSI · 360mm 수랭 쿨러',kind:'hardware',genre:'쿨러',price:179000,old:199000,colors:['#555','#111'],img:'hero-reading.jpg',cover:['MSI','CORELIQUID'],tag:'에디터 추천'},
{id:7,title:'WH-1000XM5',author:'Sony · 노이즈 캔슬링 헤드폰',kind:'peripheral',genre:'헤드셋',price:399000,old:449000,colors:['#555','#111'],img:'hero-library.jpg',cover:['SONY','WH-1000XM5'],tag:'인기 상품'},
{id:8,title:'Odyssey OLED G8 34형',author:'Samsung · 울트라와이드 모니터',kind:'peripheral',genre:'모니터',price:1190000,old:1390000,colors:['#555','#111'],img:'hero-books.jpg',cover:['SAMSUNG','ODYSSEY G8'],tag:'몰입감 최고'},
{id:9,title:'VENGEANCE DDR5 32GB 6000MHz',author:'Corsair · 메모리 킷',kind:'hardware',genre:'메모리',price:159000,old:179000,colors:['#555','#111'],img:'hero-coffee.jpg',cover:['CORSAIR','VENGEANCE'],tag:'화제의 상품'},
{id:10,title:'H9 Flow 미들타워 케이스',author:'NZXT · 듀얼 챔버 케이스',kind:'hardware',genre:'케이스',price:259000,old:289000,colors:['#555','#111'],img:'feature-reader.jpg',cover:['NZXT','H9 FLOW'],tag:'빌더 추천'}];
const slides=
'@, 'Singleline')
$html = [regex]::Replace($html, 'const slides=\[.*?\];\r?\nlet filter=', @'
const slides=[{img:'img/hero-reading.jpg',eyebrow:'NEXTECH · BUILD YOUR EDGE',title:'성능을 설계하고<br><em>한계를 새로 쓰다.</em>',desc:'엄선한 PC 부품과 게이밍 기어.<br>당신만의 완벽한 셋업을 완성하세요.'},{img:'img/hero-books.jpg',eyebrow:'POWER YOUR NEXT BUILD',title:'작은 부품 하나로<br><em>달라지는 퍼포먼스.</em>',desc:'꼼꼼하게 비교하고 자신 있게 선택하세요.<br>검증된 하드웨어를 한곳에서 만나보세요.'},{img:'img/hero-library.jpg',eyebrow:'MADE FOR YOUR PLAY',title:'매 프레임을 위한<br><em>완벽한 밸런스.</em>',desc:'게임부터 크리에이티브 작업까지.<br>목적에 맞는 최고의 조합을 찾아드립니다.'},{img:'img/hero-coffee.jpg',eyebrow:'CLEAN SETUP, CLEAR MIND',title:'당신의 책상 위에<br><em>새로운 가능성을.</em>',desc:'감각적인 주변기기와 모니터로<br>매일 앉고 싶은 셋업을 완성해 보세요.'},{img:'img/feature-reader.jpg',eyebrow:'BUILD IT YOUR WAY',title:'처음 조립부터<br><em>나만의 완성까지.</em>',desc:'초보도 안심할 수 있는 부품 가이드.<br>호환성부터 배송까지 넥스테크가 함께합니다.'}];
let filter=
'@, 'Singleline')
$html = $html.Replace("kind==='ebook'?'전자책':'종이책'", "kind==='peripheral'?'주변기기':'PC 부품'")
$html = $html.Replace("p.kind==='ebook'?'전자책':'종이책'", "p.kind==='peripheral'?'주변기기':'PC 부품'")
$html = $html.Replace("p.kind==='ebook'?'전자책 구매':'장바구니 담기'", "'장바구니 담기'")
$html = $html.Replace('<title>북웨이브 — 읽는 마음이 머무는 곳</title>', '<title>넥스테크 — 당신의 셋업을 완성하다</title>')
$html = $html.Replace('<h2>북웨이브 회원가입</h2>', '<h2>넥스테크 회원가입</h2>').Replace('로그인하고 나만의 책장을 이어가세요.', '로그인하고 나만의 셋업을 완성하세요.')
$html = $html.Replace('<strong>전자책 즉시 열람</strong><span>결제하고 바로 읽어요</span>', '<strong>호환성 맞춤 추천</strong><span>걱정 없이 완성하는 빌드</span>')
$html = $html.Replace('<strong>3만원 이상 무료배송</strong>', '<strong>5만원 이상 무료배송</strong>')
$html = $html.Replace('<strong>취향 맞춤 큐레이션</strong><span>좋아할 책을 발견하는 기쁨</span>', '<strong>전문가 셋업 가이드</strong><span>용도별 최적 부품 조합</span>')
$html = $html.Replace("p.tag==='신간'", "p.tag==='신제품'")
$html = $html.Replace("if(p.kind==='ebook'&&!member){toast('로그인 후 전자책을 구매할 수 있어요.');openModal('loginModal');return}cart.push(id);renderCart();if(p.kind==='ebook')checkout();else toast('장바구니에 담았어요.')", "cart.push(id);renderCart();toast('장바구니에 담았어요.')")
$html = $html.Replace('subtotal>=30000', 'subtotal>=50000')
$html = $html.Replace("cart.every(id=>products.find(p=>p.id===id).kind==='ebook')", "false")
$html = $html.Replace('subtotal>=50000||false?0:3000', 'subtotal>=50000?0:3000')
$html = $html.Replace("ebooks=cart.filter(id=>products.find(p=>p.id===id).kind==='ebook').length", "ebooks=0")
$html = $html.Replace('구매하고 이어 읽기', '제품 정보 확인')
$html = $html.Replace('— 북웨이브 전자책 미리보기 · 1 / 128', 'NEXTECH · PRODUCT GUIDE')
$html = $html.Replace("'img/${p.img}'", "'img/${p.img}'")
$html = $html.Replace('<div class="cover" onclick="preview(${p.id})">', '<div class="cover" style="background-image:linear-gradient(#08080818,#08080858),url(''img/${p.img}'')" onclick="preview(${p.id})">')
$html = $html.Replace('data-filter="paper">종이책', 'data-filter="hardware">PC 핵심 부품').Replace('data-filter="ebook">전자책', 'data-filter="peripheral">게이밍 기어').Replace('종이책 · 전자책', 'PC 부품 · 주변기기')
$html = $html.Replace('검색 결과가 없어요. 다른 책을 찾아볼까요?', '검색 결과가 없어요. 다른 부품을 찾아볼까요?')
$html = $html.Replace('function preview(id){let p=products.find(x=>x.id===id);if(p.kind!==''ebook''){toast(''종이책 상세 페이지를 준비하고 있어요.'');return}document.getElementById(''readerTitle'').textContent=p.title+'' · 미리보기'';openModal(''readerModal'')}', 'function preview(id){let p=products.find(x=>x.id===id);toast(`${p.title} · 상세 정보를 확인해 보세요.`)}')
$html = $html.Replace('구독 신청이 완료됐어요. 다음 편지를 기다려 주세요!', '구독 신청이 완료됐어요. 신제품 소식을 보내드릴게요!')
$html = $html.Replace('전자책 미리보기', '제품 상세 미리보기').Replace('창문으로 스며드는 오후의 빛이 책장 위에 작은 사각형을 만들었다. 오늘은 어제보다 조금 천천히 걷기로 했다. 서두르지 않아도 괜찮다는 걸, 이 한 페이지가 조용히 알려주고 있었다.', '호환성과 성능을 꼼꼼하게 확인한 넥스테크 추천 제품입니다. 당신의 사용 환경에 맞춰 안정적인 성능과 여유로운 업그레이드 가능성을 제공합니다.').Replace('우리는 자주 도착하는 일에만 마음을 쓴다. 하지만 어떤 날은 길 위에서 만난 문장 하나가 목적지보다 오래 마음에 남는다. 페이지를 넘기는 손끝에서, 다음 이야기가 시작되고 있었다.', '구매 전 궁금한 점은 고객센터로 문의해 주세요. 담당자가 용도와 예산에 맞는 구성을 함께 찾아드립니다.').Replace('— 북웨이브 전자책 미리보기 · 1 / 128', 'NEXTECH · PRODUCT GUIDE')
Set-Content -Path $path -Value $html -Encoding UTF8
Copy-Item -Force index.html outputs\index.html
