import React, { useState } from 'react';
import { Input, Select, Row, Col } from 'antd';
import {
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FilterBarProps } from '../types';

const { Option } = Select;

/**
 * 筛选和搜索组件
 * 包含关键词搜索、标签筛选、作者筛选
 */
const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onTagsChange,
  onAuthorChange,
  tags
}) => {
  const { t } = useTranslation();
  const [authorSearchValue, setAuthorSearchValue] = useState<string>('');
  
  // 处理作者搜索
  const handleAuthorSearch = (value: string) => {
    setAuthorSearchValue(value);
    onAuthorChange(value || null);
  };
  
  return (
    <div className="filter-bar">
      {/* 搜索和筛选区域 */}
      <Row gutter={[24, 16]} className="filter-bar-row">
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Input.Search
        placeholder={t('scriptMarket.search.placeholder') || "搜索脚本名称"}
        onSearch={onSearch}
        enterButton={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchOutlined style={{ color: '#fff' }} />
          </div>
        }
        allowClear
        size="large"
          />
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Input.Search
            placeholder={t('scriptMarket.filter.author') || "搜索作者"}
            onSearch={handleAuthorSearch}
            value={authorSearchValue}
            onChange={(e) => setAuthorSearchValue(e.target.value)}
            enterButton={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserOutlined style={{ color: '#fff' }} />
              </div>
            }
            allowClear
            size="large"
          />
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Select
            mode="multiple"
            placeholder={t('scriptMarket.filter.tags') || "选择标签"}
            onChange={onTagsChange}
            style={{ width: '100%' }}
            maxTagCount={3}
            allowClear
            size="large"
          >
            {tags.map(tag => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default FilterBar;