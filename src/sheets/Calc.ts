

namespace Calc
{
    export function onEditCosts()
    {
      const sheet = SpreadsheetApp.getActiveSheet();
      if(!sheet)
      {
        return;
      }

      const { B } = Constants.XCell;
      
      const values = sheet.getRange(3, B, 10, 2).getValues();
      
      const transpose_matrix = Tools.TransposeMatrix(values)
      const types = transpose_matrix[0] as (keyof typeof dropdown_val)[];
      const vals = transpose_matrix[1] as number[];

      const dropdown_val = 
      {
        'День': 1 / 7,
        'Месяц': 30 / 7,
        'Неделя': 7 / 7
      }

      let sum = 0;
      for(let i = 0; i < types.length; i++)
      {
        const t = types[i];
        if(t === undefined)
        {
            throw new Tools.UiError(`Типа '${t}' нет в коде`);
        }
        
        sum += dropdown_val[t] * vals[i];
      }
      
      new Tools.UiError(sum)


    //   new Tools.UiError(transpose_matrix + '');
    }
}