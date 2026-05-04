document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initBanner();
  setActiveNav();
  initTouchEvents();
  setViewportMeta();
});

function initMobileMenu() {
  var btn = document.querySelector('.mobile-menu-btn');
  var nav = document.querySelector('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      nav.classList.toggle('show');
    });
  }
}

function initBanner() {
  var slides = document.querySelector('.banner-slides');
  var dots = document.querySelectorAll('.banner-dot');
  var prevBtn = document.querySelector('.banner-arrow.prev');
  var nextBtn = document.querySelector('.banner-arrow.next');
  if (!slides || dots.length === 0) return;

  var current = 0;
  var total = dots.length;

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    slides.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  setInterval(function () { goTo(current + 1); }, 5000);
}

function setActiveNav() {
  var path = window.location.pathname;
  var links = document.querySelectorAll('nav a');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    }
  });
}

function loadHomePage() {
  var container = document.getElementById('news-container');
  if (!container) return;
  var news = siteData.news.slice(0, 3);
  container.innerHTML = '';
  news.forEach(function (item, index) {
    var imgSeed = 'newsimg' + item.id + index;
    container.innerHTML += '<div class="news-card" onclick="window.location.href=\'news-detail.html?id=' + item.id + '\'">' +
      '<div class="news-card-image"><img src="https://picsum.photos/seed/' + imgSeed + '/400/200" alt="' + item.title + '"><span class="news-card-category">' + item.category + '</span></div>' +
      '<div class="news-card-body">' +
      '<div class="news-card-date">' + item.date + '</div>' +
      '<h3 class="news-card-title">' + item.title + '</h3>' +
      '<p class="news-card-summary">' + item.summary + '</p>' +
      '</div></div>';
  });
}

function loadNewsPage() {
  var currentCategory = '全部';
  var currentPage = 1;

  function load() {
    var news = siteData.news;
    var filtered = news;
    if (currentCategory && currentCategory !== '全部') {
      filtered = news.filter(function (n) { return n.category === currentCategory; });
    }
    filtered.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var pageNum = currentPage;
    var pageSize = 5;
    var start = (pageNum - 1) * pageSize;
    var paginated = filtered.slice(start, start + pageSize);
    
    var container = document.getElementById('news-list');
    if (!container) return;
    container.innerHTML = '';
    paginated.forEach(function (item) {
      var dateParts = item.date.split('-');
      var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
      var monthStr = months[parseInt(dateParts[1]) - 1] || dateParts[1];
      container.innerHTML += '<div class="news-list-item" onclick="window.location.href=\'news-detail.html?id=' + item.id + '\'">' +
        '<div class="news-list-date"><div class="day">' + dateParts[2] + '</div><div class="month">' + monthStr + '</div></div>' +
        '<div class="news-list-content"><div class="news-list-category">' + item.category + '</div>' +
        '<h4>' + item.title + '</h4><p>' + item.summary + '</p></div></div>';
    });
    renderPagination(filtered.length, pageSize);
  }

  function renderPagination(total, pageSize) {
    var container = document.getElementById('pagination');
    if (!container) return;
    var totalPages = Math.ceil(total / pageSize);
    container.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active' : '';
      btn.addEventListener('click', (function (page) {
        return function () { currentPage = page; load(); };
      })(i));
      container.appendChild(btn);
    }
  }

  var filterBtns = document.querySelectorAll('.news-filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentCategory = btn.textContent;
      currentPage = 1;
      load();
    });
  });

  load();
}

function loadNewsDetail() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) return;

  var item = siteData.news.find(function (n) { return n.id === parseInt(id); });
  if (!item) return;

  var container = document.getElementById('news-detail');
  if (!container) return;
  var imgSeed = 'newsdetailimg' + item.id;
  container.innerHTML = '<a href="news.html" class="news-detail-back">&#8592; 返回新闻列表</a>' +
    '<div class="news-detail-image" style="margin-bottom:24px;border-radius:8px;overflow:hidden;"><img src="https://picsum.photos/seed/' + imgSeed + '/800/400" alt="' + item.title + '" style="width:100%;display:block;"></div>' +
    '<h2>' + item.title + '</h2>' +
    '<div class="news-detail-meta"><span>' + item.date + '</span><span>' + item.category + '</span></div>' +
    '<div class="news-detail-content"><p>' + item.content + '</p></div>';
}

function loadTeachers() {
  var container = document.getElementById('teachers-container');
  if (!container) return;
  var teachers = siteData.teachers;
  container.innerHTML = '';
  teachers.forEach(function (t, index) {
    var imgSeed = 'teacheravatar' + t.id;
    container.innerHTML += '<div class="teacher-card">' +
      '<div class="teacher-avatar"><img src="https://picsum.photos/seed/' + imgSeed + '/300/300" alt="' + t.name + '"></div>' +
      '<div class="teacher-info"><h4>' + t.name + '</h4>' +
      '<div class="title">' + t.title + '</div>' +
      '<p>' + t.description + '</p></div></div>';
  });
}

function loadAdmission() {
  var data = siteData.admission;
  var slogan = document.getElementById('admission-slogan');
  if (slogan) slogan.textContent = data.slogan;

  var plansContainer = document.getElementById('plans-container');
  if (plansContainer) {
    plansContainer.innerHTML = '';
    data.plans.forEach(function (p) {
      plansContainer.innerHTML += '<div class="plan-card"><h3>' + p.type + '</h3>' +
        '<div class="count">' + p.count + '</div><div class="count-label">人</div>' +
        '<p>' + p.description + '</p></div>';
    });
  }

  var reqContainer = document.getElementById('requirements-container');
  if (reqContainer) {
    reqContainer.innerHTML = '';
    data.requirements.forEach(function (r, i) {
      reqContainer.innerHTML += '<div class="requirement-item">' +
        '<div class="requirement-icon">' + (i + 1) + '</div><p>' + r + '</p></div>';
    });
  }

  var timelineContainer = document.getElementById('timeline-container');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';
    data.timeline.forEach(function (t, i) {
      timelineContainer.innerHTML += '<div class="step-card">' +
        '<div class="step-number">' + (i + 1) + '</div>' +
        '<h4>' + t.time + '</h4><p>' + t.event + '</p></div>';
    });
  }
}

function submitContact() {
  var form = document.getElementById('contact-form');
  var msgEl = document.getElementById('form-message');
  if (!form || !msgEl) return;

  var name = form.querySelector('[name="name"]').value.trim();
  var phone = form.querySelector('[name="phone"]').value.trim();
  var email = form.querySelector('[name="email"]').value.trim();
  var message = form.querySelector('[name="message"]').value.trim();

  if (!name || !phone || !message) {
    msgEl.className = 'form-message error';
    msgEl.textContent = '请填写姓名、电话和留言内容';
    return;
  }

  msgEl.className = 'form-message success';
  msgEl.textContent = '留言提交成功！请直接拨打联系电话：校办 88310089 或 邓老师 15084991557';
  form.reset();
}

function initTouchEvents() {
  var slides = document.querySelector('.banner-slides');
  if (!slides) return;

  var touchStartX = 0;
  var touchEndX = 0;

  slides.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slides.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      var event = new Event(diff > 0 ? 'swipeLeft' : 'swipeRight');
      slides.dispatchEvent(event);
    }
  }

  slides.addEventListener('swipeLeft', function () {
    var prevBtn = document.querySelector('.banner-arrow.next');
    if (prevBtn) prevBtn.click();
  });

  slides.addEventListener('swipeRight', function () {
    var nextBtn = document.querySelector('.banner-arrow.prev');
    if (nextBtn) nextBtn.click();
  });
}

function setViewportMeta() {
  var meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
}

document.addEventListener('click', function (e) {
  var nav = document.querySelector('nav');
  var btn = document.querySelector('.mobile-menu-btn');
  if (nav && btn && nav.classList.contains('show')) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('show');
    }
  }
});
