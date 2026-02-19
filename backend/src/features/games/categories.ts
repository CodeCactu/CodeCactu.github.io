export class Category {
  constructor(
    public name:string,
    public highestValue:number,
  ) {}
}

export const categories:Category[] = [
  new Category( `theme`, 2 ),
  new Category( `overAll`, 1 ),
]
