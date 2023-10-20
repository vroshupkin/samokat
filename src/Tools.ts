

namespace Tools
{

/**
 * Используется для взаимодействия с дропдаун ячейкой
 */
export class Dropdown
{
  private values: string[];

  /**
   * @param cell ячейка с одним значением 
   */
  constructor(cell: GoogleAppsScript.Spreadsheet.Range)
  {
    // TODO Сделать поверку что DataValidations содерржит dropdown range
    const dropdown_range = cell.getDataValidations()?.[0][0]
      ?.getCriteriaValues()[0] as GoogleAppsScript.Spreadsheet.Range;
    
    if(!dropdown_range)
    {
      throw new UiError();
    }

    this.values = dropdown_range.getValues().flat();
  }

  includes = (str: string) => 
  {
    return this.values.includes(str);
  };
}


abstract class ToStringClass 
{
  abstract toString(): string;
}
/**
 * Ошибка с всплывающим окном
 */
export class UiError extends Error
{
  constructor(message?: ToStringClass) 
  {
    super();

    this.name = 'UiError';
    this.message = message === undefined ? '' : message + '';
    SpreadsheetApp.getUi().alert(this.stack + '');
  }
}


/**
 * Переводит индекс столбца в буквенно обозначение
 * @param num индекс столбца
 * @example ConverToChar(1) = "A"; ConverToChar(10) = "J"; ConverToChar(27) = "AA"
 */
export const ConverToChar = (num: number) => 
{
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const latters: string[] = [];
  do
  {
    num -= 1;
    latters.push(alphabet[num % 26]);
    num = Math.floor(num / 26);
  }while(num > 0);

  let output = '';
  while(latters.length)
  {
    output += latters.pop();
  }
  
  return output;
};

/**
 * Создает строку из len пробелов
 * @example generate_n_spaces(5) => '     '
 */
export const generate_n_spaces = (len: number): string =>
{
  let out = '';
  while(len--) {out += ' ';}
  
  return out;
}; 

/**
   * Генерирует название колонок в JSON строке для использования в коде. Для использования нужно выделить строку с 
   * нужными строками 
   * @param range Первая ячейка строки
   * @param offset 
   */
export const GenerateColumnIndexes = (range: GoogleAppsScript.Spreadsheet.Range, offset = 1) => 
{
  // Перевести в выделение строки
  const column_names = range.getValues()[0];
  const have_dict: {[s: string]: any} = {};
  column_names.forEach((key, i) => 
  {
    key = key + '';
    while(have_dict[key] != undefined)
    {
      key += 'COPY';
    }

    have_dict[key] = Tools.ConverToChar(i + offset);
  });

  new Tools.UiError(JSON.stringify(have_dict));

  let output = '';
  let count = 0;
  for (const key in have_dict) 
  {
    const val = have_dict[key];
    
    // Поиск символа новой строки и замена на валидный символ
    const ind_newline = val.indexOf('\n');
    if(ind_newline >= 0)
    {
      val[ind_newline] = '\\\n';
    }

    const new_line = count == 2? '\n': '';
    const columns_string = `'${key}': ${val}, ${new_line}`;
    
    count = count == 2? 0: ++count;
    output += columns_string;
  }

  return `{${output}}`;
};

  /**
   * Автоматическое протягивание
   */
  export const auto_column = 
  (sheet: GoogleAppsScript.Spreadsheet.Sheet) => (start_y: number, start_x: number, rows_num: number) => 
  {
    const start_cell = sheet.getRange(start_y, start_x);
    const destination = sheet.getRange(start_y, start_x, rows_num);
    start_cell.autoFill(destination, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES); 
  };


  /** 
   * Ищет в аннотациях в первой строчки 'auto' и делает автозаполнение
   * @param header_row Строка с названием таблиц и аннотацией
   * @param insert_y Строка с изменением данных
   */
  export const auto_rectangle = (
    header_row: GoogleAppsScript.Spreadsheet.Range,
    insert_y: number
  ) => 
  { 
    const notes = header_row.getNotes()[0];
    const header_y = header_row.getRow();
    const sheet = SpreadsheetApp.getActiveSheet();

    for (let i = 0; i < notes.length; i++) 
    {
      let note = notes[i];
      note = note.split('\n')[0].trim().toLowerCase();

      if(note != 'auto') {continue;}
      
      const x =  header_row.getRow() + i;      
      const source_cell = sheet.getRange(header_y + 1, x);
      const insert_cell = sheet.getRange(insert_y, x);

      const cell_validation_type = Tools.get_cell_validation_type(source_cell);
      
      switch(cell_validation_type)
      {
        case 'default': {
          Tools.auto_column(sheet)(header_y + 1, x, insert_y - header_y);
          break;
        }
        case 'dropdown': {
          const default_dropdown_val = source_cell.getValue();
          insert_cell.setValue(default_dropdown_val);
          break;  
        }
        case 'checkbox':{
          insert_cell.setValue('');
          break;  
        }
      }
    }
  };


  export const get_cell_validation_type = (cell: GoogleAppsScript.Spreadsheet.Range) => 
  {
    const criteria_type = cell.getDataValidation()?.getCriteriaType();

    const { CHECKBOX, VALUE_IN_LIST, VALUE_IN_RANGE } = SpreadsheetApp.DataValidationCriteria;

    switch(criteria_type)
    {
      case undefined: return 'default';
      case CHECKBOX: return 'checkbox';
      case VALUE_IN_LIST: return 'dropdown';
      case VALUE_IN_RANGE: return 'dropdown';
    }
  };
    
  export function TransposeMatrix<T>(arr: T[][])
  {
    const new_arr = new Array(arr[0].length) as T[][];

    for(let i = 0; i < new_arr.length; i++)
    {
      new_arr[i] = new Array(arr.length);
    }

    for(let y = 0; y < new_arr.length; y++)
    {
      for(let x = 0; x < new_arr[0].length; x++) 
      {
        new_arr[y][x] = arr[x][y];
      }
    }

    return new_arr;

  }
}

