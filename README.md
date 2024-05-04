#  AWS 기반의 SECaaS개발 프로젝트
# Pi5neer 팀
AWS 인프라를 기반으로 웹 방화벽 Virtual appliance의 REST API 와 인터페이스하여 Web Application Firewall 형태의 SECaaS 서비스 구현

SECaaS (SECurity as a Service)
SaaS ( Software as a Service)의 일종으로 보안 서비스에 특화된 SaaS 클라우드 기반 보안 서비스

물리적인 보안 장비나 SW 등의 설치 등의 절차 없이 고객이 원하는 즉시, 원하는 만큼 보안 서비스를 바로 이용할 수 있도록 제공하는 것이 목표

![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/4d3fa4d7-538a-4262-8e29-be66f44b4f36)

![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/cd165b65-1d84-4b98-abcb-4dba39281f06)

---
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/06a081af-755a-4b24-85c5-7595dba673d6)

SECaaS 형태로 고객 웹 애플리케이션에 대한 웹 보안 서비스를 제공하기 위해
프론트엔드는 React 라이브러리의 TypeScript로, 백엔드는 Flask 프레임워크의 Python으로 개발을 진행하였습니다. 정적 파일은 Nginx를 통해, 동적 처리는 Gunicorn을 통해 관리되며, 이 모든것은 Amazon EC2에서 호스팅됩니다. 로그 관리를 위해 MySQL 엔진의 Amazon RDS를 사용합니다. SaaS 형태의 제품과 REST API, 로그를 인터페이스하여 고객들에게 보안 서비스를 제공할 수 있습니다.

---
# URL_PATH
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/837c1acb-7712-4919-b5b1-5aac71cd3173)


---

# 계층도
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/cc1b728c-219f-4a86-8df4-96dd33011cc9)

---

## ERD
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/45931af8-8ab8-4ead-81c7-ce5341db2068)


## 주요 기능

![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/887c470c-d916-4787-80b8-bf167ca5c0d6)


## specific
1. 로그인 및 회원가입 페이지 : regex 필터링 적용하여 특정 형식에 맞는 입력값을 받도록 하였으며, 회원가입 시 자동으로 보안정책을 생성하여 고객사가 등록한 애플리케이션을 Binding 해주며, 이때 세부 설정들 즉, 프로토콜, 부하분산, Source NAT 설정, Server, Group, Rule 설정이 완료됩니다.
   회원가입 과정에서 여러가지 세부 설정들이 많아서 시간이 오래 걸리는 문제를 해결하기 위해서 Basic Model 기준으로 생성 복사를 하여 시간 단축을 하는 방향으로 구현하였습니다. 그리고 토큰 처리가 있겠습니다.

2. 고객사 페이지 : 프론트엔드 단에서 SideBar UI랑 각 탭들 즉, 도메인 설정관리, 보안 설정 관리, 대시보드, 보안 로그 탭의 세부적인 틀 작성이 완료된 후, 
도메인 설정 관리 페이지에서는 고객사 도메인 CRUD 기능 및 setting 관련 안내문구 구현을 하였고, 보안 설정 관리 페이지에서는 적용 URL/예외 URL 설정 , 적용 IP/ 예외 IP, 차단 IP 설정을 할 수 있도록 하였고, 
SQL Injection, URL 정규식 검사, XSS, 디렉터리 리스팅, 쉘 코드, 파일 업/다운 로드 검사 등 등을 할 수 있는 보안 정책들을 토대로 각각 예외, 탐지, 차단을 할 수 있도록 구현하였습니다. 그리고 시그니처 기반으로 보안 로그와 관련된 설명들을 볼 수 있도록 하였습니다.
대시보드 페이지에서는 월별 트래픽 통계, 탐지된 공격과 공격이름들을 보여질 수 있도록 하였고 보안로그 페이지에서는 탐지된 시간, 감지된 요청 수, 도메인, 공격자 IP, 서버 IP/PORT, URL, 공격 위험 수준, 분류를 구현하였습니다.

3. 관리자 페이지 : CPU 사용량, Memory 사용량, 월별 트래픽 통계, 고객사 전체적인 관리 기능(등록한 고객사, 애플리케이션, 도메인, 고객사 별 보안 로그), Pagination


# 기대효과
![image](https://github.com/JeonSH-Francesco/SECaaS/assets/112309895/17821146-42b2-4a3f-a314-b7520253ab1f)
