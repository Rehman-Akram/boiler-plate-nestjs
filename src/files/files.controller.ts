import { Body, Controller, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignedUrlDto } from './dto/signed-url.dto';
import { ResponseFormat } from 'src/shared/shared.interface';
import { ResponseFormatService } from 'src/shared/response-format.service';
import { MESSAGES } from 'src/shared/constants/constants';
import { PreviewSignedUrl, SignedUrl } from './files.interface';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('get-signed-url')
  getProfileSignedUrl(@Body() body: SignedUrlDto): ResponseFormat<SignedUrl> {
    const signedUrl = this.filesService.getSignedUrl(body);
    return ResponseFormatService.responseOk<SignedUrl>(signedUrl, MESSAGES.SIGNED_URL_FETCHED);
  }

  @Post('get-preview-signed-url')
  async getProfilePreviewSignedUrl(
    @Body('url') url: string,
  ): Promise<ResponseFormat<PreviewSignedUrl>> {
    const signedUrl = await this.filesService.getPreviewSignedUrl(url);
    return ResponseFormatService.responseOk<PreviewSignedUrl>(
      signedUrl,
      MESSAGES.PREVIEW_SIGNED_URL_FETCHED,
    );
  }
}
