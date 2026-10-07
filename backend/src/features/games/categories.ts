export class Category {
  constructor(
    public name:string,
    public highestValue:number,
  ) {}
}

export const categories:Category[] = [
  new Category( `theme`, 2 ),
  new Category( `readability`, 2 ),
  new Category( `impressions`, 4 ),
  new Category( `realisation`, 4 ),
  new Category( `rules`, 2 ),
  new Category( `bonus`, 1 ),
]
