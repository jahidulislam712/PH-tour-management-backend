import { Query } from "mongoose";
import { excludeFields } from "../constants";

export class QueryBuilder<T> {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private filterObj: Record<string, any> = {}

  constructor(
    public modelQuery: Query<T[], T>,
    public readonly query: Record<string, string>,
  ) {}

  private escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getFilter(){
    return this.filterObj
  }

  filter(){
    const queryObj = {...this.query} // copy

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    excludeFields.forEach(el => delete queryObj[el])

    this.filterObj = {
      ...this.filterObj,
      ...queryObj
    }

    return this
  }

  search(searchableFields: string[]) {
    const searchKey = this.escapeRegex(this.query.searchKey?.trim() || "");

    if (!searchKey) return this;

    this.filterObj.$or = searchableFields.map((field) => {
        return { [field]: { $regex: searchKey, $options: "i" } };
      })

    return this;
  }

  fields(){
    const fields = this.query.fields?.split(",").join(" ").trim()
    if( !fields ) return this

    this.modelQuery = this.modelQuery.select(fields)

    return this
  }

  sort(){
    const sort = this.query?.sort || "-createdAt"
    this.modelQuery = this.modelQuery.sort(sort)
    return this
  }

  paginate(){
    const page = Math.max(Number(this.query?.page) || 1, 1)
    const limit = Math.max(Number(this.query?.limit) || 6, 1)
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)

    return this
  }

  build(){
    this.modelQuery = this.modelQuery.find(this.filterObj)
    return this.modelQuery
  }
}
