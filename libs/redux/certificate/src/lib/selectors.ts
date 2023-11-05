import { CertState } from './reducers'

const namespace = 'certificate'

// prettier-ignore
export default {
  getCertificates:      (state: { certificate: CertState }): any => state[namespace]?.certificates,
  getLoadingCert:       (state: { certificate: CertState }): any => state[namespace]?.loading_certificates,
  getTotal:             (state: { certificate: CertState }): any => state[namespace]?.total,
  getCertDetail:        (state: { certificate: CertState }): any => state[namespace]?.document_detail,
  getCertDetail2:       (state: { certificate: CertState }): any => state[namespace]?.document_detail_2,
  getSignatures:        (state: { certificate: CertState }): any => state[namespace]?.signatures,
  getSigners:           (state: { certificate: CertState }): any => state[namespace]?.signers,
  getSigners2:          (state: { certificate: CertState }): any => state[namespace]?.signers2,
}
