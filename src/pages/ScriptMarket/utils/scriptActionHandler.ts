import { message } from 'antd';
import { TFunction } from 'i18next'; // 导入 TFunction
import { IScript } from '../../../types/script';
import { downloadScript } from './downloadUtils';

// --- 类型定义 ---
export type ActionTarget = 'download' | 'sillytavern' | 'anotherSource'; // 可扩展

export interface ActionStrategyExecuteParams {
  targetOrigin?: string;
  [key: string]: any;
}

export interface ActionStrategy {
  execute: (script: IScript, params: ActionStrategyExecuteParams, t: TFunction) => void;
  getButtonLabelKey?: (t: TFunction) => string;
}

// --- 策略实现 ---

// 下载策略
const downloadStrategy: ActionStrategy = {
  execute: (script, _params, t) => {
    const fileName = `${script.id}.json`;
    // 注意：原始 downloadScript 返回 boolean，这里直接调用并显示消息
    // 如果 downloadScript 内部已经处理了消息，则此处可以简化
    const success = downloadScript(script.id, JSON.stringify(script, null, 2), fileName);
    if (success) {
      message.success(t('scriptMarket.detail.downloadSuccess'));
    } else {
      message.error(t('scriptMarket.detail.downloadFailed'));
    }
  },
  getButtonLabelKey: (t) => t('scriptMarket.detail.download'),
};

// SillyTavern 导入策略
const sillyTavernImportStrategy: ActionStrategy = {
  execute: (script, params, t) => {
    const scriptData: any = { // 使用 any 类型或更具体的类型，以便动态添加属性
      id: script.id,
      name: script.name,
      content: script.content,
      info: script.info,
      buttons: script.buttons,
    };
    const messagePayload = {
      action: 'importScriptToTavernHelper',
      script: scriptData,
    };

    if (window.parent && window.parent !== window && params.targetOrigin) {
      window.parent.postMessage(messagePayload, params.targetOrigin);
      message.success(t('scriptMarket.detail.importInitiated', { target: 'SillyTavern' }));
    } else {
      if (!(window.parent && window.parent !== window)) {
        message.error(t('scriptMarket.error.postMessageNotInIframe'));
      }
      if (!params.targetOrigin) {
        message.error(t('scriptMarket.error.postMessageMissingOrigin'));
      }
      message.error(t('scriptMarket.detail.importFailed', { target: 'SillyTavern' }));
    }
  },
  getButtonLabelKey: (t) => t('scriptMarket.detail.importToSillyTavern'),
};

// --- 策略映射表与常量 ---
export const DEFAULT_ACTION_TARGET: ActionTarget = 'download';
export const actionStrategies: Record<ActionTarget, ActionStrategy | undefined> = { // 允许 undefined 以便检查
  download: downloadStrategy,
  sillytavern: sillyTavernImportStrategy,
  anotherSource: undefined, // 示例：尚未实现的策略
};

export const DEFAULT_TARGET_ORIGIN: string = '*';

// --- 主要函数 ---

export const getActionTarget = (urlParams: URLSearchParams): ActionTarget => {
  const target = urlParams.get('source') as ActionTarget; // 'source' 是设计文档中确定的参数名
  if (target && actionStrategies[target]) {
    return target;
  }
  return DEFAULT_ACTION_TARGET;
};

export const getTargetOrigin = (urlParams: URLSearchParams): string => {
  return urlParams.get('targetOrigin') || DEFAULT_TARGET_ORIGIN;
};

export const handleScriptAction = (
  script: IScript,
  urlParams: URLSearchParams,
  t: TFunction
): void => {
  const currentActionTarget = getActionTarget(urlParams);
  const strategy = actionStrategies[currentActionTarget] || actionStrategies[DEFAULT_ACTION_TARGET]; // 回退到默认
  
  if (!strategy) { // 理论上因为有 DEFAULT_ACTION_TARGET，这里不会发生，但作为保险
    message.error(t('scriptMarket.error.unknownAction'));
    message.error(t('scriptMarket.error.strategyNotFound', { actionTarget: currentActionTarget, defaultActionTarget: DEFAULT_ACTION_TARGET }));
    return;
  }

  const currentTargetOrigin = getTargetOrigin(urlParams);
  const params: ActionStrategyExecuteParams = {
    targetOrigin: currentTargetOrigin,
  };

  strategy.execute(script, params, t);
};

/**
 * 获取当前操作按钮的显示文本。
 * @param urlParams URL查询参数
 * @param t 国际化函数
 * @returns 按钮的显示文本
 */
export const getActionButtonLabel = (
    urlParams: URLSearchParams,
    t: TFunction
): string => {
    const currentActionTarget = getActionTarget(urlParams);
    const strategy = actionStrategies[currentActionTarget] || actionStrategies[DEFAULT_ACTION_TARGET];

    if (strategy?.getButtonLabelKey) {
        return strategy.getButtonLabelKey(t);
    }
    // 默认或备用按钮文本
    return t('scriptMarket.detail.defaultAction');
};