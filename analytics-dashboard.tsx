import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Menu, X, TrendingUp, TrendingDown, DollarSign, Download, Calendar, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function IncomeExpenseDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const monthlyData = [
    { month: 'Ene', ingresos: 8500, egresos: 6200, balance: 2300 },
    { month: 'Feb', ingresos: 7800, egresos: 5900, balance: 1900 },
    { month: 'Mar', ingresos: 9200, egresos: 6800, balance: 2400 },
    { month: 'Abr', ingresos: 8900, egresos: 7100, balance: 1800 },
    { month: 'May', ingresos: 10500, egresos: 7500, balance: 3000 },
    { month: 'Jun', ingresos: 11200, egresos: 8100, balance: 3100 },
  ];

  const expenseCategories = [
    { name: 'Operaciones', value: 3200, color: '#ef4444' },
    { name: 'Personal', value: 2800, color: '#f59e0b' },
    { name: 'Marketing', value: 1500, color: '#8b5cf6' },
    { name: 'Otros', value: 600, color: '#6b7280' },
  ];

  const incomeCategories = [
    { name: 'Ventas', value: 6500, color: '#10b981' },
    { name: 'Servicios', value: 3200, color: '#3b82f6' },
    { name: 'Inversiones', value: 1500, color: '#06b6d4' },
  ];

  const recentTransactions = [
    { id: 1, type: 'ingreso', description: 'Venta de producto', category: 'Ventas', date: '2025-11-01', amount: 1200 },
    { id: 2, type: 'egreso', description: 'Pago de nómina', category: 'Personal', date: '2025-10-31', amount: -2800 },
    { id: 3, type: 'ingreso', description: 'Servicio de consultoría', category: 'Servicios', date: '2025-10-30', amount: 850 },
    { id: 4, type: 'egreso', description: 'Publicidad Facebook', category: 'Marketing', date: '2025-10-29', amount: -450 },
    { id: 5, type: 'egreso', description: 'Suministros de oficina', category: 'Operaciones', date: '2025-10-28', amount: -320 },
    { id: 6, type: 'ingreso', description: 'Venta mayorista', category: 'Ventas', date: '2025-10-27', amount: 2100 },
    { id: 7, type: 'egreso', description: 'Alquiler local', category: 'Operaciones', date: '2025-10-26', amount: -1500 },
    { id: 8, type: 'ingreso', description: 'Dividendos', category: 'Inversiones', date: '2025-10-25', amount: 650 },
  ];

  const totalIngresos = monthlyData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalEgresos = monthlyData.reduce((sum, item) => sum + item.egresos, 0);
  const balanceTotal = totalIngresos - totalEgresos;
  const promedioIngresos = (totalIngresos / monthlyData.length).toFixed(0);
  const promedioEgresos = (totalEgresos / monthlyData.length).toFixed(0);

  const downloadExcel = () => {
    // Crear hoja de resumen
    const summaryData = [
      ['RESUMEN FINANCIERO'],
      [''],
      ['Total Ingresos', `$${totalIngresos.toLocaleString()}`],
      ['Total Egresos', `$${totalEgresos.toLocaleString()}`],
      ['Balance Neto', `$${balanceTotal.toLocaleString()}`],
      ['Promedio Ingresos', `$${promedioIngresos}`],
      ['Promedio Egresos', `$${promedioEgresos}`],
      [''],
    ];

    // Crear hoja de datos mensuales
    const monthlyHeaders = [['Mes', 'Ingresos', 'Egresos', 'Balance']];
    const monthlyRows = monthlyData.map(row => [
      row.month,
      row.ingresos,
      row.egresos,
      row.balance
    ]);

    // Crear hoja de transacciones
    const transactionHeaders = [['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Monto']];
    const transactionRows = recentTransactions.map(t => [
      t.date,
      t.type === 'ingreso' ? 'Ingreso' : 'Egreso',
      t.description,
      t.category,
      t.amount
    ]);

    // Crear hoja de categorías de egresos
    const expenseHeaders = [['Categoría', 'Monto']];
    const expenseRows = expenseCategories.map(c => [c.name, c.value]);

    // Crear hoja de categorías de ingresos
    const incomeHeaders = [['Categoría', 'Monto']];
    const incomeRows = incomeCategories.map(c => [c.name, c.value]);

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();

    // Agregar hojas
    const wsResumen = XLSX.utils.aoa_to_sheet(summaryData);
    const wsMensual = XLSX.utils.aoa_to_sheet([...monthlyHeaders, ...monthlyRows]);
    const wsTransacciones = XLSX.utils.aoa_to_sheet([...transactionHeaders, ...transactionRows]);
    const wsEgresos = XLSX.utils.aoa_to_sheet([...expenseHeaders, ...expenseRows]);
    const wsIngresos = XLSX.utils.aoa_to_sheet([...incomeHeaders, ...incomeRows]);

    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsMensual, 'Datos Mensuales');
    XLSX.utils.book_append_sheet(wb, wsTransacciones, 'Transacciones');
    XLSX.utils.book_append_sheet(wb, wsEgresos, 'Egresos por Categoría');
    XLSX.utils.book_append_sheet(wb, wsIngresos, 'Ingresos por Categoría');

    // Descargar archivo
    XLSX.writeFile(wb, `reporte_financiero_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Finanzas</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg">
            <DollarSign size={20} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <TrendingUp size={20} />
            Ingresos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <TrendingDown size={20} />
            Egresos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <Calendar size={20} />
            Reportes
          </a>
        </nav>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Financiero</h2>
          </div>
          <button 
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download size={20} />
            Descargar Excel
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">+12.5%</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Ingresos</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">${totalIngresos.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
                <span className="text-sm font-medium text-red-600">+8.2%</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Egresos</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">${totalEgresos.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">Positivo</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Balance Neto</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">${balanceTotal.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-600">6 meses</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Promedio Mensual</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">${promedioIngresos}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencia Ingresos vs Egresos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} name="Ingresos" />
                  <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={3} name="Egresos" />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Egresos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Egresos por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart and Pie Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparativa Mensual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="egresos" fill="#ef4444" name="Egresos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Ingresos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingresos por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Transacciones Recientes</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Plus size={18} />
                Nueva
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descripción</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoría</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{transaction.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{transaction.category}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'ingreso' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}