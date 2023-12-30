# Cấu trúc dự án

- components
    - Chứa những cái component được tái sử dụng, chủ yếu dùng render UI, không bao hồm những logic (call API)
    - Ex: Button, Select, Input, Card...
    - VD:
        - Header
        - Footer
        - SideBar(Collapse Style)

- modules/modules-name
    - Chứa các components cấu thành 1 page, trong các components này sẽ chứa các logic như call API
    - VD: 
        - Home
        - ProjectManagement
        - UserManagement
        - CreateProject
        - Project
            - ProjectTitle(ProjectName, SearchBar...)
            - ProjectDetails(BackLog, Selected For Development, In Progress, Done)
            - CreateTaskButton
                - CreateTaskModal
        - AuthenticateRouter
        -...
            
- layouts
    - Chứa các components layout
    - VD: 
        - MainLayout
            - Header
            - SideBar(Collapse Style)
            - Outlet
            - Footer
        - AdminLayout
            - Header
            - Outlet
            - Footer
        - AuthenticationLayout
            - Header
            - Outlet
            - Footer
        - NotFound
            - Header
            - Outlet
            - Footer

- apis
    - Chứa cấu hình mặc định của api
    - Chứa các function định nghĩa api