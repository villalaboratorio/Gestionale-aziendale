export interface DashboardFilters {
    stato?: string;
    dataInizio?: string;
    dataFine?: string;
    ricetta?: string;
    operatore?: string;
}

export interface DashboardStats {
    total: number;
    inProgress: number;
    completed: number;
    pending: number;
}

export interface DashboardPagination {
    total: number;
    pages: number;
    currentPage: number;
    pageSize: number;
}
