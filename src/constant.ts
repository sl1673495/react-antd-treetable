import { createInternalConstant } from './utils';
// loading 的占位节点使用
export const INTERNAL_LOADING_KEY = createInternalConstant('loading');

// 树节点属性：标记树的等级
export const INTERNAL_LEVEL = createInternalConstant('level');

// 树节点属性：标记树的父层级引用
export const INTERNAL_PARENT = createInternalConstant('parent');

// 树节点属性：标记该节点正在加载更多子节点
export const INTERNAL_IS_LOADING = createInternalConstant('is_loading');

// 树节点属性：标记该节点用来渲染分页器
export const INTERNAL_PAGINATION_KEY = createInternalConstant('pagination');
