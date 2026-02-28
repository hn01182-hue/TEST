async function loadReleasedPackages() {
        const listDiv = document.getElementById('released-list');
        listDiv.innerHTML = "<p style='text-align:center; padding: 20px; color: #888;'>데이터 로드 중...</p>";
        try {
            const snapshot = await db.collection("packages").get();
            dbPackages = [];
            const apostleSet = new Set();
            snapshot.forEach(doc => {
                const data = doc.data();
                const contents = typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
                dbPackages.push({ id: doc.id, ...data, contents, releasedApostle: data.releasedApostle || "기타" });
                apostleSet.add(data.releasedApostle || "기타");
            });
            const select = document.getElementById('apostle-select');
            select.innerHTML = '<option value="all">전체 사도</option>';
            Array.from(apostleSet).sort().forEach(name => {
                const opt = document.createElement('option'); opt.value = name; opt.innerText = name; select.appendChild(opt);
            });
            filterReleased();
        } catch (e) { console.error(e); listDiv.innerHTML = "<p>로드 실패</p>"; }
    }

      function filterReleased() {
        const query = document.getElementById('pkg-search').value.toLowerCase();
        const apostle = document.getElementById('apostle-select').value;
        const type = document.getElementById('sort-type').value;
        const order = document.getElementById('sort-order').value;

        let filtered = dbPackages.filter(p => {
            return (p.name.toLowerCase().includes(query) || p.releasedApostle.toLowerCase().includes(query)) && 
                   (apostle === "all" || p.releasedApostle === apostle);
        });

        filtered.sort((a, b) => {
            let vA = (type === 'price') ? a.price : calculateScore(a.contents, a.price);
            let vB = (type === 'price') ? b.price : calculateScore(b.contents, b.price);
            return (order === 'asc') ? vA - vB : vB - vA;
        });
        renderPackageList('released-list', filtered);

        renderPackageList('released-list', filtered); // 리스트 먼저 그리고
        drawReleasedChart(filtered);
      }

 function calculateScore(contents, price) {
        if (!price || price <= 0) return 0;
        let total = 0;
        Object.entries(contents).forEach(([id, count]) => {
            const item = config.items.find(i => i.id === id);
            if (item) total += count * item.val;
        });
        return (total / price) * 1000;
    }

function renderPackageList(containerId, list) {
    const div = document.getElementById(containerId);
    div.innerHTML = list.map(pkg => {
        const score = calculateScore(pkg.contents, pkg.price).toFixed(1);
        const summary = Object.entries(pkg.contents).map(([id, count]) => {
            const item = config.items.find(i => i.id === id);
            return `${item ? item.name : id} x${count}`;
        }).join(', ');
        return `
            <div class="pkg-card">
                <span class="pkg-name">[${pkg.releasedApostle}] ${pkg.name}</span>
                <span class="pkg-price-tag">${pkg.price.toLocaleString()}원</span>
                <div><span class="eff-badge">효율 점수 : ${score}</span></div>
                <div class="pkg-items">${summary}</div>
                <button class="apply-btn" onclick="applyPackageData('${containerId}', '${pkg.id}')">이 구성으로 분석하기</button>
            </div>`;
    }).join('');
}

    function applyPackageData(sourceId, pkgId) {
        const pkg = (sourceId === 'released-list') ? dbPackages.find(p => p.id === pkgId) : constantPackages[pkgId];
        if(!pkg) return;
        document.body.style.backgroundImage = "url('images/쌀이드.gif')";
        config.price = pkg.price;
        config.items.forEach(item => { item.count = pkg.contents[item.id] || ""; });
        openTab('calc'); calculate();
    }

    function openTab(id) {
        document.querySelectorAll('.tab, .card').forEach(el => el.classList.remove('active'));
        document.querySelector(`.tab[onclick="openTab('${id}')"]`).classList.add('active');
        document.getElementById(id).classList.add('active');
        if(id === 'calc') renderCalc();
        if(id === 'settings') renderSettings();
        if(id === 'constant') renderConstantPackages();
    }

    function renderCalc() {
    document.getElementById('pkg-price').value = config.price;
    document.getElementById('item-inputs').innerHTML = config.items.map(item => `
        <div class="row">
            <div class="item-info">
                <img src="${item.icon}" class="item-icon">
                <span class="item-name">${item.name}</span>
            </div>
            <div class="input-wrapper">
                <input type="number" id="cnt-${item.id}" value="${item.count}" oninput="saveInputs()">
            </div>
        </div>`).join('');
}

    function calculate() {
        const price = parseFloat(document.getElementById('pkg-price').value);
        if(!price) return;
        let total = 0;
        config.items.forEach(item => {
            const count = parseFloat(document.getElementById(`cnt-${item.id}`).value) || 0;
            total += count * item.val;
        });
        const rate = (total / price) * 1000;
        document.getElementById('result').style.display = 'block';
        document.getElementById('res-rate').innerText = `${rate.toFixed(1)}개`;
        document.getElementById('res-total').innerText = `(환산: ${total.toLocaleString()}개)`;
    }

    function saveInputs() { config.items.forEach(item => { const input = document.getElementById(`cnt-${item.id}`); if(input) item.count = input.value; }); }
    function saveCurrentPrice() { config.price = document.getElementById('pkg-price').value; }

    function renderSettings() {
        document.getElementById('settings-list').innerHTML = config.items.map(item => `
            <div class="row">
                <div class="item-info"><img src="${item.icon}" class="item-icon"><span class="item-name">${item.name}</span></div>
                <div class="input-wrapper"><input type="number" id="val-${item.id}" value="${item.val}" step="0.1" ${item.fixed?'readonly':''} oninput="saveSettings()"></div>
            </div>`).join('');
    }

    function saveSettings() {
        config.items.forEach(item => { 
            const input = document.getElementById(`val-${item.id}`); 
            if(input) item.val = parseFloat(input.value) || 0; 
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        
        // 1. 출시/상시 패키지 리스트의 효율 점수 갱신
        filterReleased(); 
        renderConstantPackages();
        
        // 2. [추가] 현재 분석 탭의 계산 결과도 즉시 갱신
        calculate(); 
    }

    function renderConstantPackages() {
        const listDiv = document.getElementById('constant-list');
        listDiv.innerHTML = constantPackages.map((pkg, index) => {
            // 💡 상시 패키지의 효율 점수를 계산합니다.
            const score = calculateScore(pkg.contents, pkg.price).toFixed(1);
            
            const summary = Object.entries(pkg.contents).map(([id, count]) => {
                const item = config.items.find(i => i.id === id);
                return `${item ? item.name : id} x${count}`;
            }).join(', ');

            return `
                <div class="pkg-card">
                    <span class="pkg-name">${pkg.name}</span>
                    <span class="pkg-price-tag">${pkg.price.toLocaleString()}원</span>
                    <div><span class="eff-badge">효율 점수 : ${score}</span></div>
                    <div class="pkg-items">${summary}</div>
                    <button class="apply-btn" onclick="applyPackageData('constant-list', ${index})">이 구성으로 분석하기</button>
                </div>`;
        }).join('');
    }

    function loadAll() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if(saved) {
            const parsed = JSON.parse(saved);
            config.items = config.items.map(item => {
                const s = parsed.items.find(si => si.id === item.id);
                return s ? { ...item, val: s.val } : item;
            });
        }
    }

    function applyRandomBackground() {
        const bgs = [
            'images/배경1.webp', 
            'images/배경2.webp',
            'images/배경3.webp',
            'images/배경4.webp'
        ];
        document.body.style.backgroundImage = `url('${bgs[Math.floor(Math.random()*bgs.length)]}')`;
    }

    function resetConfig() { if(confirm("기본 설정으로 초기화 하시겠습니까?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); } }
    function copyShareLink() { 
        const data = encodeURIComponent(JSON.stringify(config));
        const url = `${window.location.origin}${window.location.pathname}?v=${data}`;
        navigator.clipboard.writeText(url).then(() => alert("설정 링크 복사 완료!"));
    }
let releasedChartObj = null;

function drawReleasedChart(filteredData) {
    const canvas = document.getElementById('releasedChart');
    const container = document.getElementById('chart-container');
    const wrapper = document.getElementById('chart-wrapper'); // 💡 wrapper 추가
    const selectedApostle = document.getElementById('apostle-select').value;

    if (selectedApostle === "all" || filteredData.length === 0) {
        if(container) container.style.display = 'none';
        return;
    }

    if(container) container.style.display = 'block';

    // 💡 데이터 개수에 따라 높이 계산 (1개당 40px 정도로 넉넉히)
    const dynamicHeight = Math.max(200, filteredData.length * 40); 
    
    // 💡 부모 wrapper의 높이를 직접 변경하여 캔버스가 늘어날 공간을 만듭니다.
    wrapper.style.height = dynamicHeight + 'px';
    canvas.style.height = dynamicHeight + 'px';

    const ctx = canvas.getContext('2d');

    // 은총 패키지 기준점 계산
    const gracePkg = constantPackages.find(p => p.name === "은총 패키지") || {price: 99000, contents: {p_elif: 6000}};
    const graceScore = calculateScore(gracePkg.contents, gracePkg.price);

    const labels = filteredData.map(p => p.name);
    const scores = filteredData.map(p => calculateScore(p.contents, p.price));

    if (releasedChartObj) releasedChartObj.destroy();

    releasedChartObj = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: scores,
                backgroundColor: scores.map(s => s >= graceScore ? 'rgba(125, 178, 73, 0.7)' : 'rgba(233, 30, 99, 0.7)'),
                borderColor: scores.map(s => s >= graceScore ? '#7db249' : '#e91e63'),
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false, // 💡 반드시 false여야 높이 조절이 먹힙니다.
            layout: {
                padding: { bottom: 20 } // 하단 수치 글자가 잘리지 않게 여백 추가
            },
            plugins: {
                legend: { display: false },
                // 수직 기준선(은총 패키지) 그리기
                beforeDraw: (chart) => {
                    const {ctx, chartArea: {top, bottom, left, right}, scales: {x}} = chart;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.setLineDash([5, 5]);
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x.getPixelForValue(graceScore), top);
                    ctx.lineTo(x.getPixelForValue(graceScore), bottom);
                    ctx.stroke();
                    ctx.restore();
                }
            },
            scales: {
                x: { beginAtZero: true, grid: { display: false } },
                y: { grid: { display: false } }
            }
        },
        // 기준선을 그리기 위한 커스텀 플러그인
        plugins: [{
            afterDraw: chart => {
                const {ctx, chartArea: {top, bottom}, scales: {x}} = chart;
                const xPos = x.getPixelForValue(graceScore);
                if (xPos >= chart.chartArea.left && xPos <= chart.chartArea.right) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#888';
                    ctx.setLineDash([5, 5]);
                    ctx.moveTo(xPos, top);
                    ctx.lineTo(xPos, bottom);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }]
    });
}
