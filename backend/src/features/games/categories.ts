export class Category {
  constructor(
    public name:string,
    public highestValue:number,
  ) {}
}

export const categories:Category[] = [
  new Category( `theme`, 2 ),
  new Category( `readability`, 5 ),
  new Category( `impressions`, 5 ),
  new Category( `rules`, 2 ),
  new Category( `realisation`, 5 ),
  new Category( `bonus`, 1 ),
]
