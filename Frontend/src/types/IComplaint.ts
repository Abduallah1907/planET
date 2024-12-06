export interface IComplaint {
  complaint_id: string;
  tourist_name: {
    _id: string;
    user_id: {
      _id: string;
      name: string;
    };
  };
  title: string;
  body: string;
  reply: string;
  date: Date;
  createdAt: Date;
  status: string;
  actions: "actions";
}

export interface IComplaintTourist {
  complaint_id: string;
  tourist_id: string;
  title: string;
  body: string;
  reply: string;
  date: Date;
  createdAt: Date;
  status: string;
}
