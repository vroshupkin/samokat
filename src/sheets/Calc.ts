

namespace Calc
{
    const { A, B, C } = Constants.XCell;
    
    export function onEditCosts(e: GoogleAppsScript.Events.SheetsOnEdit)
    {
      
      const sheet = SpreadsheetApp.getActiveSheet();
      e.range.getRow();
      const [ x, y ] = [ e.range.getColumn(), e.range.getRow() ];

      if(x < B || x > C || y < 3 || y > 14 || !sheet)
      {
        return;
      }

      
      const values = sheet.getRange(3, B, 10, 2).getValues();
      
      const transpose_matrix = Tools.TransposeMatrix(values);
      const types = transpose_matrix[0] as (keyof typeof dropdown_val)[];
      const vals = transpose_matrix[1] as number[];

      const dropdown_val = 
      {
        'День': 7,
        'Месяц': 7 / 30,
        'Неделя': 7 / 7,
        '': 0
      };

      let sum = 0;
      for(let i = 0; i < types.length; i++)
      {
        const t = types[i];
        if(dropdown_val[t] === undefined)
        {
          throw new Tools.UiError(`Типа '${t}' нет в коде`);
        }

        sum += dropdown_val[t] * vals[i];
      }
    
      sheet.getRange(14, B).setValue(sum);

    }
}