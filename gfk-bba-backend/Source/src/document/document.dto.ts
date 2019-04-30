interface DocumentDto {
  readonly projectId: string; // TODO wieso ist das ein String?
  readonly kind: string;
  readonly hash: string;
  readonly description: string;
  readonly linkIds: any;
  readonly payment: any;
}
