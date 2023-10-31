export interface IBook {
  id?: string;
  author: string;
  img: string;
  name: string;
  views?: number;
  category: string;
  description: string;
}

export interface IComment {
  id: string;
  bookId: string;
  userId: string;
  comment: string;
  rating: number;
  timestamp: Date;
}
export interface ICommentForm {
  comment: string;
  rate: number;
}
