export interface EndpointItem {
  name: string
  desc: string
  path: string
}

export interface Category {
  name: string
  items: EndpointItem[]
}

export interface ApiResponse {
  status: boolean
  statusCode: number
  creator: string
  totalfitur: number
  endpoints: RawCategory[]
}

export interface RawCategory {
  name: string
  items: Record<string, { desc: string; path: string }>[]
}
