import { CustomPage } from '@shared/models'
import { HttpStatusCode } from '../../../shared/core-utils/miscs/http-error-codes'
import { AbstractCommand, OverrideCommandOptions } from '../shared'

export class CustomPagesCommand extends AbstractCommand {

  getInstanceHomepage (options: OverrideCommandOptions = {}) {
    const path = '/api/v1/custom-pages/homepage/instance'

    return this.getRequestBody<CustomPage>({
      ...options,
      path,
      defaultExpectedStatus: HttpStatusCode.OK_200
    })
  }

  updateInstanceHomepage (options: OverrideCommandOptions & {
    content: string
  }) {
    const { content } = options
    const path = '/api/v1/custom-pages/homepage/instance'

    return this.putBodyRequest({
      ...options,
      path,
      fields: { content },
      defaultExpectedStatus: HttpStatusCode.NO_CONTENT_204
    })
  }
}
