export interface ReceiptRecord {
  id: string;
  user_id: string;
  picture: string;
  total: number;
  created_date: string;
}

export interface UploadReceiptFormData {
  image: string;
  total: number;
}
