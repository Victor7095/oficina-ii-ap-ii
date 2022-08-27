import { useEffect, useState } from "react";
import { Contract, ethers, Signer } from "ethers";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";

export function useContract(address, ABI): [Contract, Signer] {
  const connector = useWalletConnect();
  const [contract, setContract] = useState<Contract | null>();
  const [signer, setSigner] = useState<Signer | null>();

  useEffect(() => {
    async function loadContract() {
      if (connector.connected) {
        console.log("LOADING CONTRACT");
        const provider = new WalletConnectProvider({
          rpc: {
            3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
          },
          chainId: 3,
          connector: connector,
          qrcode: false,
        });
        await provider.enable();
        const ethersProvider = new ethers.providers.Web3Provider(provider);

        const newSigner = ethersProvider.getSigner();
        const newContract = new ethers.Contract(address, ABI, newSigner);
        setContract(newContract);
        setSigner(newSigner);
        console.log("NEW SIGNER", await newSigner.getAddress());
      }
    }
    loadContract();
  }, [connector.connected]);

  return [contract, signer];
}
