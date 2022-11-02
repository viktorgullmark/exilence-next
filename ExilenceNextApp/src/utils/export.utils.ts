import { ExportToCsv } from 'export-to-csv';
import moment from 'moment';

export function exportData<T>(data: T[], documentTitle: string = 'Export') {
  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: `Data from ${moment(Date.now()).format('YYYY-MM-DD HH:mm')}`,
    useBom: true,
    useKeysAsHeaders: true,
    filename: `${documentTitle}_${moment(Date.now()).format('YYYY-MM-DD-HH-mm')}`,
  };

  const csvExporter = new ExportToCsv(options);

  csvExporter.generateCsv(data);
}
