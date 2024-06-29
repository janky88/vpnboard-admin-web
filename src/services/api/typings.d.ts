declare namespace API {
  type Announcement = {
    content?: string;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enable?: boolean;
    id?: number;
    title?: string;
    /** update time */
    updated_at?: string;
  };

  type CheckUserNameRequest = {
    user_name?: string;
  };

  type CheckUserNameResponse = {
    /** 0-unregistered user 1-registered user 2-migrate user 99-banned user */
    type?: UserType;
  };

  type CloseTicketRequest = {
    ticket_id: number;
  };

  type Coupon = {
    /** Amount in cents */
    amount?: number;
    code?: string;
    /** 1: Discount, 2: Amount */
    coupon_type: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    /** Discount percentage */
    discount?: number;
    enable?: boolean;
    expire?: CouponExpire;
    id?: number;
    max_use?: number;
    max_use_per_user?: number;
    name?: string;
    product_ids?: number[];
    /** update time */
    updated_at?: string;
    used?: number;
  };

  type CouponExpire = {
    from?: string;
    to?: string;
  };

  type CreateAnnouncementRequest = {
    content?: string;
    title?: string;
  };

  type CreateCouponRequest = {
    /** Amount in cents */
    amount?: number;
    code?: string;
    /** 1: Discount, 2: Amount */
    coupon_type: number;
    /** Discount percentage */
    discount?: number;
    enable?: boolean;
    expire?: CouponExpire;
    max_use?: number;
    max_use_per_user?: number;
    name?: string;
    product_ids?: number[];
    quantity?: number;
    used?: number;
  };

  type CreateKnowledgeRequest = {
    content?: string;
    title?: string;
  };

  type CreateNodeGroupRequest = {
    name: string;
    node_group_order?: number;
    remarks?: string;
  };

  type CreateNodeRequest = {
    address?: string;
    enabled?: boolean;
    extra_config?: NodeExtra;
    name: string;
    node_group_id?: number;
    node_order?: number;
    node_speed_limit?: number;
    node_type?: string;
    port?: number;
    protocol?: string;
    remarks?: string;
    status?: NodeStatus;
    traffic_rate?: number;
  };

  type CreateOrderRequest = {
    coupon_id?: number;
    duration: number;
    product_id: number;
  };

  type CreateOrderResponse = {
    order_id?: number;
  };

  type CreatePaymentRequest = {
    order_id?: number;
    payment_type?: PaymentType;
  };

  type CreatePaymentResponse = {
    payment_id?: number;
    status?: number;
  };

  type CreateProductGroupRequest = {
    name?: string;
    product?: Product[];
    product_group_order?: number;
    remarks?: string;
  };

  type CreateProductRequest = {
    description?: string;
    enable_traffic_reset?: boolean;
    is_sale?: boolean;
    is_show?: boolean;
    name: string;
    node_connector?: number;
    node_groups?: number[];
    node_speed_limit?: number;
    nodes?: number[];
    price?: ProductPriceItem[];
    price_traffic_reset?: number;
    product_group_id?: number;
    product_order?: number;
    quota?: number;
    remarks?: string;
    stock?: number;
    total_bandwidth?: number;
  };

  type CreateTicketRequest = {
    content: string;
    title: string;
  };

  type CreateUserRequest = {
    balance?: number;
    duration?: number;
    is_manager?: boolean;
    password?: string;
    product_id?: number;
    refer_code?: string;
    referer_username?: string;
    user_name: string;
  };

  type CreateUserResponse = {
    avatar?: string;
    balance?: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enable?: boolean;
    id?: number;
    is_manager?: boolean;
    nick_name?: string;
    refer_code?: string;
    referer_id?: number;
    /** update time */
    updated_at?: string;
    user_name?: string;
  };

  type DeleteAnnouncementRequest = {
    id?: number;
  };

  type DeleteCouponRequest = {
    id?: number;
  };

  type DeletedAt = {
    time?: string;
    /** Valid is true if Time is not NULL */
    valid?: boolean;
  };

  type DeleteKnowledgeRequest = {
    id?: number;
  };

  type DeleteNodeGroupRequest = {
    id: number;
  };

  type DeleteNodeRequest = {
    id: number;
  };

  type DeleteProductGroupRequest = {
    id: number;
  };

  type DeleteProductRequest = {
    id: number;
  };

  type DeleteUserRequest = {
    id?: number;
  };

  type GetAliPayF2FConfigResponse = {
    alipay_app_id?: string;
    alipay_private_key?: string;
    alipay_public_key?: string;
    enable?: boolean;
    fee?: number;
    fee_percent?: number;
    goods_name?: string;
    icon_url?: string;
    notify_url?: string;
    show_name?: string;
  };

  type GetEmailConfigResponse = {
    email_template?: string;
    from_email?: string;
    from_name?: string;
    smtp_encrypted?: string;
    smtp_host?: string;
    smtp_password?: string;
    smtp_port?: number;
    smtp_username?: string;
  };

  type GetEPayConfigResponse = {
    enable?: boolean;
    fee?: number;
    fee_percent?: number;
    icon_url?: string;
    key?: string;
    notify_url?: string;
    pid?: string;
    show_name?: string;
    url?: string;
  };

  type GetInviteConfigResponse = {
    forced_invite?: boolean;
    only_first_purchase?: boolean;
    referral_percentage?: number;
  };

  type GetNodeConfigResponse = {
    node_key?: string;
    node_pull_interval?: number;
    node_push_interval?: number;
  };

  type GetRegisterConfigResponse = {
    email_verify?: boolean;
    email_whitelist?: string;
    enable_email_whitelist?: boolean;
    enable_ip_limit?: boolean;
    ip_limit?: number;
    ip_limit_duration?: number;
    stop_register?: boolean;
    trial?: boolean;
  };

  type GetSiteConfigResponse = {
    enable_register?: boolean;
    host?: string;
    site_desc?: string;
    site_logo?: string;
    site_name?: string;
  };

  type GetSubscribeConfigResponse = {
    app?: SubscribeAppConfig;
    single_model?: boolean;
    subscribe_path?: string;
    subscribe_url?: string;
    wildcard_resolution?: boolean;
  };

  type GetTelegramConfigResponse = {
    bot_token?: string;
    enable_notify?: boolean;
    group_url?: string;
  };

  type GetTicketContentRequest = {
    ticket_id: number;
  };

  type GetTicketContentResponse = {
    list?: TicketContent[];
  };

  type GetTOCConfigResponse = {
    content?: string;
  };

  type GetUserInfoResponse = {
    avatar?: string;
    balance?: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enable?: boolean;
    id?: number;
    is_manager?: boolean;
    nick_name?: string;
    refer_code?: string;
    referer_id?: number;
    /** update time */
    updated_at?: string;
    user_name?: string;
  };

  type GetVerifyCodeConfigResponse = {
    enable_login_verify_code?: boolean;
    enable_register_verify_code?: boolean;
    enable_reset_password_verify_code?: boolean;
    turnstile_secret?: string;
    turnstile_site_key?: string;
  };

  type Knowledge = {
    category?: string;
    content?: string;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enable?: boolean;
    id?: number;
    title?: string;
    /** update time */
    updated_at?: string;
  };

  type ListAnnouncementRequest = {
    page?: number;
    size?: number;
  };

  type ListAnnouncementResponse = {
    list?: Announcement[];
    total?: number;
  };

  type ListCouponRequest = {
    page?: number;
    size?: number;
  };

  type ListCouponResponse = {
    list?: Coupon[];
    total?: number;
  };

  type ListKnowledgeRequest = {
    page?: number;
    size?: number;
  };

  type ListKnowledgeResponse = {
    list?: Knowledge[];
    total?: number;
  };

  type ListNodeGroupRequest = {
    page?: number;
    size?: number;
  };

  type ListNodeGroupResponse = {
    list?: NodeGroup[];
    total?: number;
  };

  type ListNodeRequest = {
    node_group_id?: number;
    page?: number;
    size?: number;
  };

  type ListNodeResponse = {
    list?: Node[];
    total?: number;
  };

  type ListOrderRequest = {
    page?: number;
    size?: number;
  };

  type ListOrderResponse = {
    list?: Order[];
    total?: number;
  };

  type ListPaymentRequest = {
    order_id?: number;
    page?: number;
    size?: number;
    status?: PaymentStatus;
  };

  type ListPaymentResponse = {
    list?: Payment[];
    total?: number;
  };

  type ListProductGroupResponse = {
    list?: ProductGroup[];
  };

  type ListProductRequest = {
    product_group_id?: number;
  };

  type ListProductResponse = {
    list?: Product[];
  };

  type ListSubscribeSchemeTypeResponse = {
    scheme_types?: string[];
  };

  type ListTicketRequest = {
    page?: number;
    size?: number;
    status?: TicketStatus;
  };

  type ListTicketResponse = {
    list?: Ticket[];
    total?: number;
  };

  type ListUserRequest = {
    page?: number;
    size?: number;
  };

  type ListUserResponse = {
    list?: User[];
    total?: number;
  };

  type LoginRequest = {
    password?: string;
    user_name?: string;
  };

  type LoginResponse = {
    token?: string;
  };

  type Node = {
    address?: string;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enabled?: boolean;
    extra_config?: NodeExtra;
    id?: number;
    name: string;
    node_group_id?: number;
    node_order?: number;
    node_speed_limit?: number;
    node_type?: string;
    port?: number;
    protocol?: string;
    remarks?: string;
    status?: NodeStatus;
    traffic_rate?: number;
    /** update time */
    updated_at?: string;
  };

  type NodeExtra = {
    enable_tls?: boolean;
    enable_vless?: boolean;
    host?: string;
    hy_down_mbps?: number;
    hy_obfs?: string;
    hy_obfs_password?: string;
    hy_ports?: string;
    hy_up_mbps?: number;
    method?: string;
    network?: string;
    path?: string;
    server_key?: string;
    service_name?: string;
    /** 中转参数 */
    transfer_address?: string;
    transfer_port?: number;
    transport_protocol?: string;
  };

  type NodeGroup = {
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    id?: number;
    name: string;
    node_group_order?: number;
    remarks?: string;
    /** update time */
    updated_at?: string;
  };

  type NodeInfoRequest = {
    node_id?: number;
  };

  type NodeInfoResponse = {
    address?: string;
    enable_tls?: boolean;
    enable_vless?: boolean;
    host?: string;
    method?: string;
    name?: string;
    node_order?: number;
    node_speed_limit?: number;
    node_type?: string;
    path?: string;
    port?: number;
    remarks?: string;
    server_key?: string;
    service_name?: string;
    transport_protocol?: string;
  };

  type NodeStatus = 1 | 0;

  type Order = {
    balance_amount?: number;
    buyer_pay_amount?: number;
    coupon_amount?: number;
    coupon_id?: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    /** Duration in month */
    duration?: number;
    id?: number;
    original_amount?: number;
    product_id?: number;
    /** Order Status: 0: Pending, 1: Paid, 2: Failed, 3: Canceled */
    status?: OrderStatus;
    total_amount?: number;
    trade_no?: string;
    /** update time */
    updated_at?: string;
    user_id?: number;
  };

  type OrderStatus = 1 | 2 | 3 | 4 | 5;

  type Payment = {
    amount?: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    id?: number;
    order_id?: number;
    pay_time?: string;
    payment_type?: PaymentType;
    status?: PaymentStatus;
    /** update time */
    updated_at?: string;
    user_id?: number;
  };

  type PaymentStatus = 1 | 2 | 3 | 4;

  type PaymentType = 1 | 2 | 3;

  type Product = {
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    description?: string;
    enable_traffic_reset?: boolean;
    id?: number;
    is_sale?: boolean;
    is_show?: boolean;
    name: string;
    node_connector?: number;
    node_groups?: NodeGroup[];
    node_speed_limit?: number;
    nodes?: Node[];
    price?: ProductPriceItem[];
    price_traffic_reset?: number;
    product_group_id?: number;
    product_order?: number;
    quota?: number;
    remarks?: string;
    stock?: number;
    total_bandwidth?: number;
    /** update time */
    updated_at?: string;
  };

  type ProductGroup = {
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    id?: number;
    name?: string;
    product?: Product[];
    product_group_order?: number;
    remarks?: string;
    /** update time */
    updated_at?: string;
  };

  type ProductPriceItem = {
    month?: number;
    price?: number;
  };

  type Response = {
    code?: number;
    data?: any;
    msg?: string;
  };

  type SendMessageRequest = {
    content: string;
    content_type: TicketContentType;
    ticket_id: number;
  };

  type SubscribeAppConfig = {
    android?: SubscribeAppItemConfig[];
    ios?: SubscribeAppItemConfig[];
    linux?: SubscribeAppItemConfig[];
    macos?: SubscribeAppItemConfig[];
    windows?: SubscribeAppItemConfig[];
  };

  type SubscribeAppItemConfig = {
    icon?: string;
    name?: string;
    scheme_type?: string;
    url?: string;
  };

  type Ticket = {
    /** created time */
    created_at?: string;
    creator_id?: number;
    /** delete time */
    deleted_at?: DeletedAt;
    id?: number;
    status?: TicketStatus;
    title?: string;
    /** update time */
    updated_at?: string;
  };

  type TicketContent = {
    content?: string;
    content_type?: TicketContentType;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    id?: number;
    sender_id?: number;
    ticket_id?: number;
    /** update time */
    updated_at?: string;
  };

  type TicketContentType = 'text' | 'image';

  type TicketStatus = 1 | 2;

  type UpdateAliPayF2FConfigRequest = {
    alipay_app_id?: string;
    alipay_private_key?: string;
    alipay_public_key?: string;
    enable?: boolean;
    fee?: number;
    fee_percent?: number;
    goods_name?: string;
    icon_url?: string;
    notify_url?: string;
    show_name?: string;
  };

  type UpdateAnnouncementRequest = {
    content?: string;
    enable?: boolean;
    id?: number;
    title?: string;
  };

  type UpdateCouponRequest = {
    /** Amount in cents */
    amount?: number;
    code?: string;
    /** 1: Discount, 2: Amount */
    coupon_type: number;
    /** Discount percentage */
    discount?: number;
    enable?: boolean;
    expire?: CouponExpire;
    id?: number;
    max_use?: number;
    max_use_per_user?: number;
    name?: string;
    product_ids?: number[];
    used?: number;
  };

  type UpdateEmailConfigRequest = {
    email_template?: string;
    from_email?: string;
    from_name?: string;
    smtp_encrypted?: string;
    smtp_host?: string;
    smtp_password?: string;
    smtp_port?: number;
    smtp_username?: string;
  };

  type UpdateEPayConfigRequest = {
    enable?: boolean;
    fee?: number;
    fee_percent?: number;
    icon_url?: string;
    key?: string;
    notify_url?: string;
    pid?: string;
    show_name?: string;
    url?: string;
  };

  type UpdateInviteConfigRequest = {
    forced_invite?: boolean;
    only_first_purchase?: boolean;
    referral_percentage?: number;
  };

  type UpdateKnowledgeRequest = {
    category?: string;
    content?: string;
    enable?: boolean;
    id?: number;
    title?: string;
  };

  type UpdateNodeConfigRequest = {
    node_key?: string;
    node_pull_interval?: number;
    node_push_interval?: number;
  };

  type UpdateNodeGroupRequest = {
    id: number;
    name: string;
    node_group_order?: number;
    remarks?: string;
  };

  type UpdateNodeRequest = {
    address?: string;
    enabled?: boolean;
    extra_config?: NodeExtra;
    id: number;
    name: string;
    node_group_id?: number;
    node_order?: number;
    node_speed_limit?: number;
    node_type?: string;
    port?: number;
    protocol?: string;
    remarks?: string;
    status?: NodeStatus;
    traffic_rate?: number;
  };

  type UpdateProductGroupRequest = {
    id: number;
    name?: string;
    product?: Product[];
    product_group_order?: number;
    remarks?: string;
  };

  type UpdateProductRequest = {
    description?: string;
    enable_traffic_reset?: boolean;
    id: number;
    is_sale?: boolean;
    is_show?: boolean;
    name: string;
    node_connector?: number;
    node_groups?: number[];
    node_speed_limit?: number;
    nodes?: number[];
    price?: ProductPriceItem[];
    price_traffic_reset?: number;
    product_group_id?: number;
    product_order?: number;
    quota?: number;
    remarks?: string;
    stock?: number;
    total_bandwidth?: number;
  };

  type UpdateRegisterConfigRequest = {
    email_verify?: boolean;
    email_whitelist?: string;
    enable_email_whitelist?: boolean;
    enable_ip_limit?: boolean;
    ip_limit?: number;
    ip_limit_duration?: number;
    stop_register?: boolean;
    trial?: boolean;
  };

  type UpdateSiteConfigRequest = {
    enable_register?: boolean;
    host?: string;
    site_desc?: string;
    site_logo?: string;
    site_name?: string;
  };

  type UpdateSubscribeConfigRequest = {
    app?: SubscribeAppConfig;
    single_model?: boolean;
    subscribe_path?: string;
    subscribe_url?: string;
    wildcard_resolution?: boolean;
  };

  type UpdateTelegramConfigRequest = {
    bot_token?: string;
    enable_notify?: boolean;
    group_url?: string;
  };

  type UpdateTOCConfigRequest = {
    content?: string;
  };

  type UpdateUserRequest = {
    avatar?: string;
    balance?: number;
    enable?: boolean;
    id?: number;
    is_manager?: boolean;
    nick_name?: string;
    refer_code?: string;
    referer_id?: number;
    user_name?: string;
  };

  type UpdateVerifyCodeConfigRequest = {
    enable_login_verify_code?: boolean;
    enable_register_verify_code?: boolean;
    enable_reset_password_verify_code?: boolean;
    turnstile_secret?: string;
    turnstile_site_key?: string;
  };

  type User = {
    avatar?: string;
    balance?: number;
    /** created time */
    created_at?: string;
    /** delete time */
    deleted_at?: DeletedAt;
    enable?: boolean;
    id?: number;
    is_manager?: boolean;
    nick_name?: string;
    refer_code?: string;
    referer_id?: number;
    /** update time */
    updated_at?: string;
    user_name?: string;
  };

  type UserListRequest = {
    node_id?: number;
  };

  type UserListResponse = {
    list?: UserListResponseItem[];
  };

  type UserListResponseItem = {
    device_limit?: number;
    speed_limit?: number;
    uid?: number;
    user_name?: string;
    uuid?: string;
  };

  type UserType = 0 | 1 | 2 | 99;
}
