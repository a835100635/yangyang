function CustomAudio(config) {
  const { template } = config;
  if (!template) {
    console.log('无播放音乐控件');
    return;
  }

  // 配置
  this.config = config

  // dom元素
  this.audio = null;
  // 播放状态
  this.playStatus = false;

  // 点击音
  this.clickBgmAudio = null;
  this.playClickStatus = false;


  this.init();
}

CustomAudio.prototype.init = function() {
  const { bgmSrc, clickBgm } = this.config;
  this.createAudioDom([
    {
      key: 'audio',
      loop: true,
      src: bgmSrc
    }, 
    {
      key: 'clickBgmAudio',
      loop: false,
      src: clickBgm
    }
  ]);
}

// 播发
CustomAudio.prototype.play = function () {
  if (!this.playStatus && this.audio) { 
    this.audio.play()
    this.playStatus = true;
  }
}

// 暂停
CustomAudio.prototype.pause = function () {
  if (this.playStatus && this.audio) {
    this.audio.pause()
    this.playStatus = false;
  }
}

// 重新播放
CustomAudio.prototype.replay = function () {
  this.pause();
  if (!this.playStatus && this.audio) {
    this.audio.currentTime = 0;
    this.play();
  }
}

// 消除声
CustomAudio.prototype.playClickBgm = function () {
  if (!this.playClickStatus && this.clickBgmAudio) {
    this.clickBgmAudio.play();
    this.playClickStatus = true;
  } 
}
// 重播消除声
CustomAudio.prototype.rePlayClickBgm = function () {
  if (this.clickBgmAudio) {
    this.clickBgmAudio.currentTime = 0;
    this.playClickBgm();
    this.playClickStatus = false;
  }
}

// 创建audio dom元素
CustomAudio.prototype.createAudioDom = function(config) {
  const { template } = this.config;
  config.forEach(item => {
    this[item.key] = document.createElement('audio');
    this[item.key].setAttribute('controls', '');
    if (item.loop) {
      this[item.key].setAttribute('loop', '');
    }
    
    const source = document.createElement('source');
    source.setAttribute('type', "audio/mpeg");
    source.src = item.src;
    
    this[item.key].appendChild(source);
    
    this[item.key].setAttribute('style', 'display: none');
    
    document.querySelector(template).appendChild(this[item.key])
  });
}