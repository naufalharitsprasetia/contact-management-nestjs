export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  size: number;
  current_page: number;
  total_page: number;
}
