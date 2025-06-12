// 等待DOM加载完成后执行
window.onload = () => {

  // 获取页面上的元素
  // const studentNameInput = document.getElementById('studentName'); // 已移除
  const schoolInput = document.getElementById('school');
  const majorInput = document.getElementById('major');
  const offerImageInput = document.getElementById('offerImage');
  const previewImage = document.getElementById('preview');
  const generateBtn = document.getElementById('generateBtn');
  const posterResultImg = document.getElementById('posterResult');
  const resultWrapper = document.querySelector('.result-wrapper');

  let offerImageUrl = null;

  // 监听文件上传，并显示预览图
  offerImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      // 使用URL.createObjectURL创建一个临时的URL用于显示和绘制
      offerImageUrl = URL.createObjectURL(file);
      previewImage.src = offerImageUrl;
      previewImage.style.display = 'block';
    }
  });

  // 点击生成按钮的事件
  generateBtn.addEventListener('click', async () => {
    // 获取所有输入值
    const school = schoolInput.value;
    const major = majorInput.value;

    // 简单验证 (已移除学生姓名)
    if (!school || !major || !offerImageUrl) {
      alert('请填写所有信息并上传Offer截图！');
      return;
    }
    
    generateBtn.innerText = '正在生成中...';
    generateBtn.disabled = true;

    try {
      // 1. 获取canvas元素和2D上下文
      const canvas = document.getElementById('posterCanvas');
      const ctx = canvas.getContext('2d');

      // 2. 设置canvas的尺寸 (与背景图一致)
      canvas.width = 750;
      canvas.height = 1334;

      // 3. 加载并绘制图片 (背景图和Offer截图)
      const bgImage = await loadImage('background.png'); // 确保你的新背景图命名为此
      const offerImage = await loadImage(offerImageUrl);

      // 绘制背景
      ctx.drawImage(bgImage, 0, 0, 750, 1334);

      // =================================================================
      // --- 这里是根据你的新布局调整好的绘制代码 ---
      // =================================================================

      // 4. 绘制文字 (注意：对齐方式已改为左对齐)
      ctx.textAlign = 'left'; // 重要：改为左对齐

      // 绘制学校 "英国帝国理工学院"
      ctx.font = 'bold 40px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#FFFFFF'; // 白色
      ctx.fillText(school, 85, 550); // (x,y) 从左上角开始算

      // 绘制专业 "化学工程博士"
      ctx.font = 'bold 40px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#FFFFFF'; // 白色
      ctx.fillText(major, 85, 670); // Y坐标在学校下方

      // 5. 绘制Offer截图
      // 根据新布局，放在下方的白色区域内
      ctx.drawImage(offerImage, 85, 800, 580, 400); 
      
      // =================================================================
      // --- 调整代码结束 ---
      // =================================================================

      // 6. 从canvas导出图片数据
      const finalImageDataUrl = canvas.toDataURL('image/png');

      // 7. 显示最终的海报
      posterResultImg.src = finalImageDataUrl;
      resultWrapper.style.display = 'block';

      // 8. 自动下载海报 (文件名已修改)
      const link = document.createElement('a');
      link.href = finalImageDataUrl;
      link.download = `喜报-${school}.png`; // 使用学校名作为文件名
      link.click();

    } catch (error) {
      console.error('生成海报失败:', error);
      alert('生成海报失败，请检查图片或联系管理员。');
    } finally {
      // 恢复按钮状态
      generateBtn.innerText = '一键生成录取喜报';
      generateBtn.disabled = false;
    }
  });

  // 封装一个函数用于加载图片，返回一个Promise
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // 解决图片跨域问题
      img.crossOrigin = 'Anonymous'; 
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }
};
