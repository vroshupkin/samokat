
const atEdit = (e: GoogleAppsScript.Events.SheetsOnEdit) => 
{
  const sheet_name = e.source.getActiveSheet().getName();

  switch (sheet_name as typeof Constants.SHEETS.CALC) 
  {
    case 'Расчет':
      Calc.onEditCosts(e);
      break;
  
    default:
      break;
  }
  
};

// function onOpen() 
// {
//   Menus.MenuDiscoqs();
//   Menus.MenuMacros();
// }

