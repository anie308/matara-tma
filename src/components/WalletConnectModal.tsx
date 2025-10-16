import React, { useEffect } from 'react';
import { useReownWallet } from '../services/reownWallet';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { openModal } = useReownWallet();

  useEffect(() => {
    if (isOpen) {
      // Immediately open the Reown modal when this modal is opened
      openModal();
      // Close this modal since Reown modal will handle the connection
      onClose();
    }
  }, [isOpen, openModal, onClose]);

  // This component doesn't render anything - it just triggers the Reown modal
  return null;
};
