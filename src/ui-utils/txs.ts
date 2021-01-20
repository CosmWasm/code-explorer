import { cosmWasmTypes } from "@cosmjs/cosmwasm-stargate";
import { fromBase64 } from "@cosmjs/encoding";
import { Msg, pubkeyType, WrappedStdTx } from "@cosmjs/launchpad";
import { Registry } from "@cosmjs/proto-signing";
import { AminoTypes, codec } from "@cosmjs/stargate";
import Long from "long";

type IAny = codec.google.protobuf.IAny;
type ITx = codec.cosmos.tx.v1beta1.ITx;

const { Tx } = codec.cosmos.tx.v1beta1;
const { SignMode } = codec.cosmos.tx.signing.v1beta1;
const { PublicKey } = codec.tendermint.crypto;

export const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
export const msgStoreCodeTypeUrl = "/cosmwasm.wasm.v1beta1.MsgStoreCode";
export const msgInstantiateContractTypeUrl = "/cosmwasm.wasm.v1beta1.MsgInstantiateContract";
export const msgExecuteContractTypeUrl = "/cosmwasm.wasm.v1beta1.MsgExecuteContract";

export interface AnyMsgSend {
  readonly type_url: "/cosmos.bank.v1beta1.MsgSend";
  readonly value: Uint8Array;
}

export interface AnyMsgStoreCode {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgStoreCode";
  readonly value: Uint8Array;
}

export interface AnyMsgInstantiateContract {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgInstantiateContract";
  readonly value: Uint8Array;
}

export interface AnyMsgExecuteContract {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgExecuteContract";
  readonly value: Uint8Array;
}

export function isAnyMsgSend(msg: IAny): msg is AnyMsgSend {
  return msg.type_url === msgSendTypeUrl && !!msg.value;
}

export function isAnyMsgStoreCode(msg: IAny): msg is AnyMsgStoreCode {
  return msg.type_url === msgStoreCodeTypeUrl && !!msg.value;
}

export function isAnyMsgInstantiateContract(msg: IAny): msg is AnyMsgInstantiateContract {
  return msg.type_url === msgInstantiateContractTypeUrl && !!msg.value;
}

export function isAnyMsgExecuteContract(msg: IAny): msg is AnyMsgExecuteContract {
  return msg.type_url === msgExecuteContractTypeUrl && !!msg.value;
}

const aminoTypes = new AminoTypes({
  additions: cosmWasmTypes,
});

/* eslint-disable @typescript-eslint/camelcase */
function launchpadMsgToStargateMsg(typeRegistry: Registry, msg: Msg): IAny {
  const stargateMsg = aminoTypes.fromAmino(msg);
  return {
    type_url: stargateMsg.typeUrl,
    value: typeRegistry.encode(stargateMsg),
  };
}

export function launchpadTxToStargateTx(typeRegistry: Registry, tx: WrappedStdTx): Uint8Array {
  const stargateTx: ITx = {
    body: {
      messages: tx.value.msg.map((msg) => launchpadMsgToStargateMsg(typeRegistry, msg)),
      memo: tx.value.memo,
    },
    authInfo: {
      signerInfos: tx.value.signatures.map(({ pub_key }) => ({
        publicKey: {
          type: "/tendermint.crypto.PublicKey",
          value: PublicKey.encode(
            PublicKey.create({
              ed25519: pub_key.type === pubkeyType.ed25519 ? fromBase64(pub_key.value) : null,
              secp256k1: pub_key.type === pubkeyType.secp256k1 ? fromBase64(pub_key.value) : null,
            }),
          ).finish(),
        },
        modeInfo: { single: { mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON } },
        // TODO: Use real values
        sequence: Long.fromNumber(0),
      })),
      fee: {
        amount: [...tx.value.fee.amount],
        gasLimit: Long.fromString(tx.value.fee.gas),
        // TODO: Use real values
        payer: undefined,
        // TODO: Use real values
        granter: undefined,
      },
    },
    signatures: tx.value.signatures.map(({ signature }) => fromBase64(signature)),
  };
  return Tx.encode(Tx.create(stargateTx)).finish();
}
/* eslint-enable @typescript-eslint/camelcase */
