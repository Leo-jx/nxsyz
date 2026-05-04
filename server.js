const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function readJSON(filename) {
  const filepath = path.join(__dirname, 'data', filename);
  const data = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data);
}

app.get('/api/news', (req, res) => {
  try {
    const news = readJSON('news.json');
    const { category, limit, page } = req.query;
    let filtered = news;
    if (category && category !== '全部') {
      filtered = news.filter(n => n.category === category);
    }
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const start = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    res.json({
      total: filtered.length,
      page: pageNum,
      pageSize,
      data: paginated
    });
  } catch (err) {
    res.status(500).json({ error: '读取新闻数据失败' });
  }
});

app.get('/api/news/:id', (req, res) => {
  try {
    const news = readJSON('news.json');
    const item = news.find(n => n.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: '新闻不存在' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: '读取新闻数据失败' });
  }
});

app.get('/api/teachers', (req, res) => {
  try {
    const teachers = readJSON('teachers.json');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: '读取教师数据失败' });
  }
});

app.get('/api/admission', (req, res) => {
  try {
    const admission = readJSON('admission.json');
    res.json(admission);
  } catch (err) {
    res.status(500).json({ error: '读取招生数据失败' });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: '请填写必要的联系信息' });
    }
    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    let contacts = [];
    if (fs.existsSync(contactsPath)) {
      contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
    }
    contacts.push({
      id: contacts.length + 1,
      name,
      phone,
      email: email || '',
      message,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    res.json({ success: true, message: '留言提交成功，我们会尽快与您联系！' });
  } catch (err) {
    res.status(500).json({ error: '提交留言失败，请稍后重试' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`宁乡市第十一高级中学官网服务已启动`);
  console.log(`访问地址: http://localhost:${PORT}`);
});
