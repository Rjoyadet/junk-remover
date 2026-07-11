(function() {
  // Service area: example ZIPs (replace with your real list or API)
  var servedZips = ['90210', '90211', '90212', '10001', '10002', '10003', '60601', '60602', '75201', '77001', '85001', '98101', '02101', '19101', '30301'];

  function normalizeZip(val) {
    return String(val).replace(/\D/g, '').slice(0, 5);
  }

  function isServed(zip) {
    return servedZips.indexOf(normalizeZip(zip)) !== -1;
  }

  // Instant price estimator
  var priceEl = document.getElementById('priceEstimate');
  document.querySelectorAll('.truck-opt').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.truck-opt').forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      var low = btn.getAttribute('data-low');
      var high = btn.getAttribute('data-high');
      priceEl.innerHTML = '<span class="range">Est. </span>$' + low + ' – $' + high;
    });
  });

  // Service area checker
  var zipInput = document.getElementById('zipInput');
  var areaResult = document.getElementById('areaResult');
  document.getElementById('checkZipBtn').addEventListener('click', function() {
    var zip = normalizeZip(zipInput.value);
    areaResult.classList.remove('visible', 'yes', 'no');
    if (zip.length < 5) {
      areaResult.textContent = 'Please enter a 5-digit ZIP code.';
      areaResult.classList.add('visible', 'no');
      return;
    }
    if (isServed(zip)) {
      areaResult.textContent = 'We serve your area! Give us a call or request a quote.';
      areaResult.classList.add('visible', 'yes');
    } else {
      areaResult.textContent = 'Not in our service area yet. Contact us—we may still be able to help.';
      areaResult.classList.add('visible', 'no');
    }
  });
  zipInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('checkZipBtn').click();
    }
  });

  // Item removal calculator
  var items = [];
  var itemPrices = {};
  document.querySelectorAll('#itemSelect option[data-price]').forEach(function(opt) {
    itemPrices[opt.value] = parseInt(opt.getAttribute('data-price'), 10);
  });

  function getItemLabel(value) {
    var opt = document.querySelector('#itemSelect option[value="' + value + '"]');
    return opt ? opt.textContent.split('—')[0].trim() : value;
  }

  function renderItemList() {
    var list = document.getElementById('itemCalcList');
    var totalEl = document.getElementById('itemCalcTotal');
    var amountEl = document.getElementById('itemTotalAmount');
    list.innerHTML = '';
    var total = 0;
    items.forEach(function(entry, i) {
      total += entry.price * entry.qty;
      var row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML =
        '<span>' + getItemLabel(entry.id) + ' × ' + entry.qty + '</span>' +
        '<div class="qty-controls">' +
          '<button type="button" class="qty-btn" data-index="' + i + '" data-delta="-1" aria-label="Decrease">−</button>' +
          '<span class="qty-num">' + entry.qty + '</span>' +
          '<button type="button" class="qty-btn" data-index="' + i + '" data-delta="1" aria-label="Increase">+</button>' +
        '</div>' +
        '<span class="item-total">$' + (entry.price * entry.qty) + '</span>';
      list.appendChild(row);
    });
    list.querySelectorAll('.qty-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var delta = parseInt(btn.getAttribute('data-delta'), 10);
        items[idx].qty = Math.max(0, items[idx].qty + delta);
        if (items[idx].qty === 0) items.splice(idx, 1);
        renderItemList();
      });
    });
    if (items.length > 0) {
      totalEl.style.display = 'flex';
      amountEl.textContent = '$' + total;
    } else {
      totalEl.style.display = 'none';
    }
  }

  document.getElementById('addItemBtn').addEventListener('click', function() {
    var sel = document.getElementById('itemSelect');
    var value = sel.value;
    if (!value) return;
    var price = itemPrices[value];
    var existing = items.find(function(e) { return e.id === value; });
    if (existing) existing.qty++; else items.push({ id: value, price: price, qty: 1 });
    sel.value = '';
    renderItemList();
  });
  document.getElementById('itemSelect').addEventListener('change', function() {
    if (this.value) document.getElementById('addItemBtn').click();
  });
  renderItemList();

  // Quick quote form
  document.getElementById('quickQuoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var success = document.getElementById('quickQuoteSuccess');
    success.classList.add('visible');
    this.reset();
    setTimeout(function() { success.classList.remove('visible'); }, 5000);
  });
})();

