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

function fetchJSON(url) {
  return fetch(url).then(function (res) { return res.json(); });
}

function loadHomePage() {
  fetchJSON('/api/news?limit=3').then(function (res) {
    var container = document.getElementById('news-container');
    if (!container || !res.data) return;
    container.innerHTML = '';
    res.data.forEach(function (news, index) {
      var imgSeed = 'newsimg' + news.id + index;
      container.innerHTML += '<div class="news-card" onclick="window.location.href=\'news-detail.html?id=' + news.id + '\'">' +
        '<div class="news-card-image"><img src="https://picsum.photos/seed/' + imgSeed + '/400/200" alt="' + news.title + '"><span class="news-card-category">' + news.category + '</span></div>' +
        '<div class="news-card-body">' +
        '<div class="news-card-date">' + news.date + '</div>' +
        '<h3 class="news-card-title">' + news.title + '</h3>' +
        '<p class="news-card-summary">' + news.summary + '</p>' +
        '</div></div>';
    });
  }).catch(function () {});
}

function loadNewsPage() {
  var currentCategory = '全部';
  var currentPage = 1;

  function load() {
    var url = '/api/news?category=' + currentCategory + '&page=' + currentPage + '&limit=5';
    fetchJSON(url).then(function (res) {
      var container = document.getElementById('news-list');
      if (!container) return;
      container.innerHTML = '';
      res.data.forEach(function (news, index) {
        var dateParts = news.date.split('-');
        var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        var monthStr = months[parseInt(dateParts[1]) - 1] || dateParts[1];
        container.innerHTML += '<div class="news-list-item" onclick="window.location.href=\'news-detail.html?id=' + news.id + '\'">' +
          '<div class="news-list-date"><div class="day">' + dateParts[2] + '</div><div class="month">' + monthStr + '</div></div>' +
          '<div class="news-list-content"><div class="news-list-category">' + news.category + '</div>' +
          '<h4>' + news.title + '</h4><p>' + news.summary + '</p></div></div>';
      });
      renderPagination(res.total, res.pageSize);
    }).catch(function () {});
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

  fetchJSON('/api/news/' + id).then(function (news) {
    var container = document.getElementById('news-detail');
    if (!container) return;
    var imgSeed = 'newsdetailimg' + news.id;
    container.innerHTML = '<a href="news.html" class="news-detail-back">&#8592; 返回新闻列表</a>' +
      '<div class="news-detail-image" style="margin-bottom:24px;border-radius:8px;overflow:hidden;"><img src="https://picsum.photos/seed/' + imgSeed + '/800/400" alt="' + news.title + '" style="width:100%;display:block;"></div>' +
      '<h2>' + news.title + '</h2>' +
      '<div class="news-detail-meta"><span>' + news.date + '</span><span>' + news.category + '</span></div>' +
      '<div class="news-detail-content"><p>' + news.content + '</p></div>';
  }).catch(function () {});
}

function loadTeachers() {
  fetchJSON('/api/teachers').then(function (teachers) {
    var container = document.getElementById('teachers-container');
    if (!container) return;
    container.innerHTML = '';
    teachers.forEach(function (t, index) {
      var imgSeed = 'teacheravatar' + t.id;
      container.innerHTML += '<div class="teacher-card">' +
        '<div class="teacher-avatar"><img src="https://picsum.photos/seed/' + imgSeed + '/300/300" alt="' + t.name + '"></div>' +
        '<div class="teacher-info"><h4>' + t.name + '</h4>' +
        '<div class="title">' + t.title + '</div>' +
        '<p>' + t.description + '</p></div></div>';
    });
  }).catch(function () {});
}

function loadAdmission() {
  fetchJSON('/api/admission').then(function (data) {
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
  }).catch(function () {});
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

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, phone: phone, email: email, message: message })
  }).then(function (res) { return res.json(); }).then(function (data) {
    if (data.success) {
      msgEl.className = 'form-message success';
      msgEl.textContent = data.message;
      form.reset();
    } else {
      msgEl.className = 'form-message error';
      msgEl.textContent = data.error || '提交失败';
    }
  }).catch(function () {
    msgEl.className = 'form-message error';
    msgEl.textContent = '网络错误，请稍后重试';
  });
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
