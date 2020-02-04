import moment from 'moment';
import { ExportToCsv } from 'export-to-csv';

export function exportData<T>(data: T[], documentTitle: string = 'Export') {
  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: `Data from ${moment(Date.now()).format('YYYY-MM-DD HH:MM')}`,
    useBom: true,
    useKeysAsHeaders: true,
    filename: `${documentTitle}_${moment(Date.now()).format('YYYY-MM-DD')}`
  };

  const csvExporter = new ExportToCsv(options);

  csvExporter.generateCsv(data);
}
