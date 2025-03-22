export interface ReceiptRecord {
  id: string;
  user_id: string;
  image_url: string;
  total: number;
  created_at: string;
}

export interface UploadReceiptFormData {
  image: string;
  total: number;
}
