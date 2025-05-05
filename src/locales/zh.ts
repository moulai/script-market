/**
 * 中文翻译
 */
const zh = {
  // 通用
  common: {
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    upload: '上传',
    reset: '重置',
    back: '返回',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    required: '必填',
    optional: '可选',
    yes: '是',
    no: '否',
    update: '更新',
    delete: '删除',
  },
  
  // 导航
  nav: {
    title: '脚本市场上传',
    language: '语言',
  },
  
  // 表单字段
  form: {
    id: {
      label: '脚本ID',
      placeholder: '请输入符合文件命名规范的ID',
      help: 'ID将是脚本在仓库中的唯一标识符，只能包含字母、数字、下划线和连字符',
      error: 'ID格式不正确',
    },
    password: {
      label: '更新与删除密码',
      placeholder: '请输入密码',
      help: '用于后续更新和删除操作，请妥善保管',
      error: '密码不能为空',
      incorrect: '密码不正确',
      verify: '请输入密码以验证',
    },
    name: {
      label: '脚本名称',
      placeholder: '请输入脚本名称',
      error: '名称不能为空',
    },
    author: {
      label: '作者',
      placeholder: '请输入作者名称',
      error: '作者不能为空',
    },
    version: {
      label: '版本号',
      placeholder: '自动生成，可选修改',
      help: '默认根据时间戳自动生成',
    },
    tags: {
      label: '标签',
      placeholder: '请选择标签',
      help: '可多选',
    },
    content: {
      label: '脚本内容',
      placeholder: '请输入脚本代码',
      error: '脚本内容不能为空',
    },
    info: {
      label: '作者备注',
      placeholder: '请输入备注信息（可选）',
    },
    buttons: {
      label: '按钮触发',
      add: '添加按钮',
      remove: '删除',
      id: '按钮ID',
      name: '按钮名称',
      description: '按钮描述',
      visible: '可见',
      invisible: '隐藏',
    },
  },
  
  // 确认对话框
  confirm: {
    title: '确认上传',
    content: '请确认以下信息是否正确：',
    submit: '确认上传',
    cancel: '返回修改',
  },
  
  // 文件已存在
  fileExists: {
    title: '文件已存在',
    content: '检测到该ID的脚本已存在，请选择操作：',
    passwordVerify: '请输入原密码进行验证',
    updateQuestion: '您希望如何处理已存在的脚本？',
    updateScript: '更新脚本',
    deleteScript: '删除脚本',
    cancel: '取消操作',
    incorrectPassword: '密码不正确，无法继续操作',
  },
  
  // 结果页
  result: {
    success: {
      title: '操作成功',
      content: '您的脚本已成功上传到GitHub仓库',
      update: '脚本已成功更新',
      delete: '脚本已成功删除',
    },
    error: {
      title: '上传失败',
      content: '上传过程中出现错误',
      retry: '重试',
      updateFailed: '更新失败',
      deleteFailed: '删除失败',
    },
    script: {
      name: '脚本名称',
      url: '文件链接',
      view: '查看文件',
    },
    credentials: {
      title: '脚本凭据信息',
      description: '请务必妥善保存以下凭据。脚本 ID 是仓库中的唯一标识，未来若需更新或删除脚本，将必须使用相同的 ID 和密码进行操作。',
      id: '脚本 ID',
      password: '脚本密码',
      copy: '复制',
      copyAll: '一键复制全部凭据',
      idCopied: '脚本 ID 已复制',
      passwordCopied: '脚本密码已复制',
      allCopied: '脚本凭据已复制'
    }
  },
  
  // 验证信息
  validation: {
    idFormat: 'ID只能包含字母、数字、下划线和连字符',
    nameFormat: '脚本名称不能包含下列字符: / \\ : * ? " < > |',
    required: '此字段为必填项',
    buttonIdRequired: '按钮ID为必填项',
    buttonNameRequired: '按钮名称为必填项',
  },
  
  // 脚本市场页面
  scriptMarket: {
    title: '脚本市场',
    pageTitle: '脚本目录',
    
    // 搜索和筛选
    search: {
      placeholder: '搜索脚本名称'
    },
    filter: {
      tags: '选择标签',
      author: '搜索作者'
    },
    sort: {
      label: '排序',
      updatedAt: '最近更新',
      createdAt: '创建时间',
      name: '名称'
    },
    view: {
      card: '卡片视图',
      table: '表格视图'
    },
    
    // 卡片视图
    card: {
      viewDetails: '查看详情',
      updated: '更新于',
      version: '版本'
    },
    
    // 表格视图
    table: {
      name: '名称',
      author: '作者',
      tags: '标签',
      version: '版本',
      updatedAt: '更新时间',
      action: '操作',
      viewDetails: '查看详情',
      download: '下载脚本'
    },
    
    // 分页
    pagination: {
      total: '共',
      items: '项'
    },
    
    // 详情模态框
    detail: {
      title: '脚本详情',
      author: '作者',
      version: '版本',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      content: '脚本内容',
      buttons: '按钮配置',
      visible: '可见',
      invisible: '隐藏',
      download: '下载脚本',
      copy: '复制内容',
      downloadSuccess: '下载成功',
      downloadFailed: '下载失败',
      copySuccess: '复制成功',
      copyFailed: '复制失败',
      noData: '没有找到脚本数据'
    },
    
    // 页脚
    footer: {
      total: '脚本总数',
      lastUpdated: '最后更新',
      copyright: '脚本市场'
    },
    
    // 错误信息
    error: {
      title: '加载错误'
    },
    
    // 空状态
    empty: '没有找到匹配的脚本',
    
    // 刷新按钮
    refresh: '刷新'
  }
};

export default zh;