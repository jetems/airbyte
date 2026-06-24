-- JETEMS: 初始化 temporal 数据库和用户
-- temporal 用户需 CREATEDB 权限（auto-setup 会创建/重建 visibility 库的 schema）
CREATE USER temporal WITH PASSWORD 'temporal' CREATEDB;
CREATE DATABASE temporal OWNER temporal;
CREATE DATABASE temporal_visibility OWNER temporal;
GRANT ALL PRIVILEGES ON DATABASE temporal TO temporal;
GRANT ALL PRIVILEGES ON DATABASE temporal_visibility TO temporal;
