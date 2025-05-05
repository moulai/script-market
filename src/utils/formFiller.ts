import { IScript } from '../types/script';
import { FormInstance } from 'antd';

/**
 * 使用提供的数据填充表单
 * @param form Ant Design表单实例
 * @param data 要填充的数据
 */
export const fillFormWithData = (form: FormInstance, data: Partial<IScript>) => {
  // 创建要设置的表单值对象
  const formValues: Partial<IScript> = {};
  
  // 遍历可能的字段并添加到表单值中
  if (data.id !== undefined) formValues.id = data.id;
  if (data.password !== undefined) formValues.password = data.password;
  if (data.name !== undefined) formValues.name = data.name;
  if (data.author !== undefined) formValues.author = data.author;
  if (data.version !== undefined) formValues.version = data.version;
  if (data.tags !== undefined) formValues.tags = data.tags;
  if (data.content !== undefined) formValues.content = data.content;
  if (data.info !== undefined) formValues.info = data.info;
  if (data.buttons !== undefined) formValues.buttons = data.buttons;
  
  // 设置表单值
  form.setFieldsValue(formValues);
  
  console.log('表单已填充数据:', formValues);
};

/**
 * 监听来自其他窗口的消息，用于接收表单数据
 * @param form Ant Design表单实例
 */
export const listenForFormData = (form: FormInstance) => {
  const messageHandler = (event: MessageEvent) => {
    try {
      // 检查消息来源和数据格式
      if (!event.data || typeof event.data !== 'object') return;
      
      // 尝试解析消息中的脚本数据
      const scriptData = event.data as Partial<IScript>;
      
      // 如果消息中包含脚本数据，则填充表单
      if (scriptData) {
        console.log('接收到POST消息数据:', scriptData);
        fillFormWithData(form, scriptData);
      }
    } catch (error) {
      console.error('处理表单数据消息时出错:', error);
    }
  };

  // 添加消息事件监听器
  window.addEventListener('message', messageHandler);
  
  // 返回清理函数，用于在组件卸载时移除事件监听器
  return () => {
    window.removeEventListener('message', messageHandler);
  };
};

/**
 * 通过URL查询参数接收JSON数据
 * 支持两种方式：
 * 1. 直接通过'json'参数传递JSON字符串
 * 2. 通过'data'参数传递base64编码的JSON字符串（适用于较长的数据）
 * @param form Ant Design表单实例
 */
export const checkForUrlData = (form: FormInstance) => {
  try {
    // 获取URL中的参数
    // 支持 HashRouter 模式，从 hash 后面获取查询参数
    // 例如从 http://localhost:4173/script-market/#/upload?json=%7 中获取 ?json=%7
    let search = window.location.search;
    
    // 如果使用了 HashRouter，查询参数会在 hash 后面
    if (window.location.hash) {
      const hashParts = window.location.hash.split('?');
      if (hashParts.length > 1) {
        search = '?' + hashParts[1];
      }
    }
    
    const urlParams = new URLSearchParams(search);
    
    // 尝试从'json'参数获取数据
    const jsonParam = urlParams.get('json');
    if (jsonParam) {
      const data = JSON.parse(decodeURIComponent(jsonParam)) as Partial<IScript>;
      console.log('从URL json参数接收到数据:', data);
      fillFormWithData(form, data);
      
      // 清除URL参数以避免刷新时重复填充
      // 保留哈希路径部分，只清除查询参数
      const hashPath = window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, window.location.pathname + hashPath);
      return;
    }
    
    // 尝试从'data'参数获取base64编码的数据
    const dataParam = urlParams.get('data');
    if (dataParam) {
      try {
        // 将URL安全的Base64转换回标准Base64
        let base64 = dataParam.replace(/-/g, '+').replace(/_/g, '/');
        // 添加缺失的填充字符
        while (base64.length % 4) {
          base64 += '=';
        }
        
        // 解码base64数据（支持Unicode字符）
        const jsonString = decodeURIComponent(escape(window.atob(base64)));
        const data = JSON.parse(jsonString) as Partial<IScript>;
        
        console.log('从URL data参数接收到base64编码数据:', data);
        fillFormWithData(form, data);
        
        // 清除URL参数以避免刷新时重复填充
        // 保留哈希路径部分，只清除查询参数
        const hashPath = window.location.hash.split('?')[0];
        window.history.replaceState({}, document.title, window.location.pathname + hashPath);
      } catch (error) {
        console.error('解析base64编码数据时出错:', error);
      }
    }
  } catch (error) {
    console.error('处理URL数据时出错:', error);
  }
};

/**
 * 解码Base64编码的UTF-8字符串为JSON对象
 * @param base64Str Base64编码的字符串
 * @returns 解码后的JSON对象，如果解码失败则返回null
 */
export const decodeBase64ToJson = (base64Str: string): any => {
  try {
    // 将URL安全的Base64转换回标准Base64
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    // 添加缺失的填充字符
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // 将Base64解码为UTF-8字符串，然后解析为JSON
    return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  } catch (e) {
    console.error('解码Base64字符串时出错:', e);
    return null;
  }
};

/**
 * 初始化表单数据接收器
 * 同时检查URL参数和设置消息监听器
 * @param form Ant Design表单实例
 */
export const initFormDataReceiver = (form: FormInstance) => {
  // 检查URL参数
  checkForUrlData(form);
  
  // 设置消息监听器并返回清理函数
  return listenForFormData(form);
};

/**
 * 生成用于测试的示例数据URL
 * @param data 要编码的数据
 * @param useBase64 是否使用base64编码
 * @returns 包含数据的完整URL
 */
export const generateTestUrl = (data: Partial<IScript>, useBase64: boolean = false): string => {
  // 获取基础URL，考虑 HashRouter 模式
  // 如果是 HashRouter 模式，需要包含 hash 路径部分（例如 #/upload）
  let baseUrl = window.location.origin + window.location.pathname;
  
  // 如果存在哈希路径，保留路径部分
  if (window.location.hash) {
    const hashPath = window.location.hash.split('?')[0];
    baseUrl += hashPath;
  }
  
  if (useBase64) {
    // 使用base64编码（适用于较长的数据）
    const jsonString = JSON.stringify(data);
    // 将字符串转换为UTF-8编码，然后进行Base64编码（支持Unicode字符）
    let base64Data = window.btoa(unescape(encodeURIComponent(jsonString)));
    
    // 转换为URL安全的Base64（替换+为-，/为_，去掉=）
    base64Data = base64Data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return `${baseUrl}?data=${base64Data}`;
  } else {
    // 直接使用JSON（适用于较短的数据）
    const jsonString = encodeURIComponent(JSON.stringify(data));
    return `${baseUrl}?json=${jsonString}`;
  }
};