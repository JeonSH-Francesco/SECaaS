#  AWS 기반의 SECaaS개발 프로젝트
# Pi5neer 팀
AWS 인프라를 기반으로 웹 방화벽 Virtual appliance의 REST API 와 인터페이스하여 Web Application Firewall 형태의 SECaaS 서비스 구현

SECaaS (SECurity as a Service)
SaaS ( Software as a Service)의 일종으로 보안 서비스에 특화된 SaaS 클라우드 기반 보안 서비스

물리적인 보안 장비나 SW 등의 설치 등의 절차 없이 고객이 원하는 즉시, 원하는 만큼 보안 서비스를 바로 이용할 수 있도록 제공하는 것이 목표

![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/4d3fa4d7-538a-4262-8e29-be66f44b4f36)

![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/cd165b65-1d84-4b98-abcb-4dba39281f06)

---
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/268c9c6d-ad1b-4c83-b44b-06642e605d77)
SECaaS 형태로 고객 웹 애플리케이션에 대한 웹 보안 서비스를 제공하기 위해
프론트엔드는 React 라이브러리의 TypeScript로, 백엔드는 Flask 프레임워크의 Python으로 개발을 진행하였습니다. 정적 파일은 Nginx를 통해, 동적 처리는 Gunicorn을 통해 관리되며, 이 모든것은 Amazon EC2에서 호스팅됩니다. 로그 관리를 위해 MySQL 엔진의 Amazon RDS를 사용합니다. SaaS 형태의 제품과 REST API, 로그를 인터페이스하여 고객들에게 보안 서비스를 제공할 수 있습니다.
