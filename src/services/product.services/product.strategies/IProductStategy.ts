export default interface IProductStategy {
  Create(input: any): Promise<any>
  Update(input: any): Promise<any>
}
