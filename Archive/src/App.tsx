import { QuoteScreen } from './components/QuoteScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { StatusScreen } from './components/StatusScreen';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useTransactionStore } from './store/transactionStore';
import type { QuoteResponse } from './types';
import './App.css';

function App() {
  // Zustand store state
  const { stage, quote, transactionId } = useTransactionStore();
  const { setStage, setQuote, setTransactionId, resetTransaction, clearQuote } = useTransactionStore();

  const handleNewTransaction = () => {
    resetTransaction();
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>OpenFX</h1>
        </header>
        {/* can be route as well */}
        <main className="app-main">
          {stage === 'quote' && (
            <QuoteScreen />
          )}

          {stage === 'payment' && quote && (
            <PaymentScreen
              quote={quote}
            />
          )}

          {stage === 'status' && transactionId && (
            <StatusScreen
              transactionId={transactionId}
            />
          )}
        </main>

        <footer className="app-footer">
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;