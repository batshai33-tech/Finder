import { useRef, useState } from 'react'

function ImageUploader({ imageUrl, onImageUrlChange, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const selectFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return

    setPreviewUrl(URL.createObjectURL(file))
    onFileChange?.(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  const handleUrlChange = (event) => {
    setPreviewUrl('')
    onImageUrlChange(event.target.value)
    onFileChange?.(null)
  }

  const imageSource = previewUrl || imageUrl

  return (
    <div className="input-field">
      <label>사진 (선택)</label>
      <div
        className={`image-upload-box ${isDragging ? 'is-dragging' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {imageSource ? (
          <img src={imageSource} alt="선택한 물품 미리보기" className="image-upload-preview" />
        ) : (
          <>
            <span className="image-upload-icon" aria-hidden="true">＋</span>
            <p>사진을 여기로 끌어 놓거나</p>
            <button type="button" className="image-upload-button" onClick={() => inputRef.current?.click()}>
              파일에서 선택하기
            </button>
          </>
        )}
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={(event) => selectFile(event.target.files[0])}
        />
      </div>
      <input
        id="imageUrl"
        name="imageUrl"
        value={imageUrl}
        placeholder="또는 이미지 URL을 입력하세요"
        onChange={handleUrlChange}
      />
      <small className="field-help">이미지 파일은 현재 미리보기만 지원해. 서버 사진 업로드 API가 연결되면 실제 등록에 함께 전송돼.</small>
    </div>
  )
}

export default ImageUploader
